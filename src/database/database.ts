const DATABASE_TABLE_NAME = "movies" as const;
const DATABASE_NAME = "task-mates-db" as const;

let db: IDBDatabase | null = null;
const dbVersion = 1;

type TEntry<TData = object> = {
  id: string;
  type: string;
  data: TData;
};

export const database = {
  checkIfOpen: () => !!db,

  openConnection: async (): Promise<void> => {
    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, dbVersion);

        request.onupgradeneeded = (event) => {
          db = (event.target as IDBOpenDBRequest).result;
          createResourceTable(db);
        };

        request.onsuccess = (event) => {
          db = (event.target as IDBOpenDBRequest).result;
          resolve(undefined);
        };

        request.onerror = (event) => {
          reject((event.target as IDBOpenDBRequest).error);
        };
      });
    } catch (error) {
      console.error("openConnection error: ", error);
      return new Promise((resolve) => resolve());
    }
  },

  closeConnection: (): void => {
    if (db) {
      db.close();
      db = null;
    }
  },

  getTotalCount: async (): Promise<number> => {
    try {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject("Database is not open");
          return;
        }

        const transaction = db.transaction([DATABASE_TABLE_NAME], "readonly");
        const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
        const request = objectStore.count();

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("getTotalCount error: ", error);
      return 0;
    }
  },

  queryItemById: async <TData extends object>(id: string): Promise<TData | undefined> => {
    try {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject("Database is not open");
          return;
        }

        const transaction = db.transaction([DATABASE_TABLE_NAME], "readonly");
        const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
        const request = objectStore.get(id);

        request.onsuccess = () => {
          resolve(request.result?.data);
        };

        request.onerror = (event) => {
          console.error("queryItemById error: ", (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error(`queryItemById error for id "${id}": `, error);
      return undefined;
    }
  },

  queryDatabase: async <TData extends object>({
    type,
    page = 1,
    pageSize = 15,
    queryFn,
  }: {
    /**
     * - The type of the item to query.
     */
    type: string;
    /**
     * - The page number to fetch.
     * @default 1
     */
    page?: string | number;
    /**
     * - The number of items to return per page.
     * @default 15
     */
    pageSize?: number;
    /**
     * - A function that checks if the item should be included in the results.
     *    - "true" the item will be included in the results.
     *    - "false" the item will be skipped.
     */
    queryFn?: (data: TData) => boolean;
  }): Promise<{
    /**
     * - The items that match the queryFn check for the checked page.
     */
    results: TData[];
    /**
     * - The last page number that contains items that match the queryFn check.
     */
    lastPage: number;
    /**
     * - The total number of items that match the queryFn check.
     */
    count: number;
  }> => {
    try {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject("Database is not open");
          return;
        }

        const transaction = db.transaction([DATABASE_TABLE_NAME], "readonly");
        const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
        const request = objectStore.openCursor();

        const numPage = typeof page === "string" ? Number(page) : page;
        const startIndex = (numPage - 1) * pageSize;

        const results: TEntry<TData>[] = [];

        /**
         * - Defines the number of items that match the passed "type" and pass the queryFn check.
         * - Used to determine the total number of items that match the query for pagination purposes.
         */
        let totalItemCount = 0;

        /**
         * - Defines how many items have been iterated through that do not belong on the current page.
         * - This is used to determine when to start adding items to the results array.
         */
        let prevPageItems = 0;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (!cursor) {
            resolve({
              results: results.map((res) => res.data),
              lastPage: Math.ceil(totalItemCount / pageSize),
              count: totalItemCount,
            });

            return;
          }

          const cursorValue: TEntry<TData> = cursor.value;

          if (type === cursorValue.type) {
            const satisfiesQuery = typeof queryFn === "function" ? queryFn(cursorValue.data) : true;

            if (satisfiesQuery) {
              totalItemCount++;

              if (prevPageItems < startIndex) {
                prevPageItems++;
              } else if (results.length < pageSize) {
                results.push(cursorValue);
              }
            }
          }

          cursor.continue();
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error(`queryDatabase - ${type} - error: `, error);

      return {
        results: [],
        lastPage: 0,
        count: 0,
      };
    }
  },

  upsertItem: async <T extends { id: string }>(type: string, item: T) => {
    try {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject("Database is not open");
          return;
        }

        const transaction = db.transaction([DATABASE_TABLE_NAME], "readwrite");
        const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
        const request = objectStore.put({ id: item.id, type, data: item });

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject((e.target as IDBRequest).error);
      });
    } catch (error) {
      console.error("upsertItem error: ", error);
    }
  },

  upsertMultipleItems: async <T extends { id: string }>(type: string, itemList: T[]) => {
    if (itemList.length === 0) {
      return;
    }

    const promiseList = itemList.map((item) => database.upsertItem(type, item));
    await Promise.all(promiseList);
  },

  deleteItem: async (id: TEntry["id"]): Promise<void> => {
    try {
      return new Promise((resolve, reject) => {
        if (!db) {
          database.openConnection();
          return;
        }

        const transaction = db.transaction([DATABASE_TABLE_NAME], "readwrite");
        const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("deleteItem error: ", error);
      return new Promise((resolve) => resolve());
    }
  },

  deleteMultipleItems: async (idList: string[]): Promise<void> => {
    if (idList.length === 0) {
      return;
    }

    const promiseList = idList.map((id) => database.deleteItem(id));
    await Promise.all(promiseList);
  },

  deleteAllItems: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database is not open");
        return;
      }

      const transaction = db.transaction([DATABASE_TABLE_NAME], "readwrite");
      const objectStore = transaction.objectStore(DATABASE_TABLE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  },
} as const;

const createResourceTable = async (dbInstance: IDBDatabase) => {
  const tableAlreadyExists = dbInstance.objectStoreNames.contains(DATABASE_TABLE_NAME);

  if (tableAlreadyExists) {
    return;
  }

  const objectStore = dbInstance.createObjectStore(DATABASE_TABLE_NAME, {
    keyPath: "id",
  });

  objectStore.createIndex("type", "type", { unique: false });
  objectStore.createIndex("data", "data", { unique: false });
};
