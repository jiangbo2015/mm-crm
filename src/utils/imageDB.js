class ImageDB {
    constructor(dbName = 'ImageCacheDB', storeName = 'images') {
      if (typeof indexedDB === 'undefined') {
        throw new Error('IndexedDB is not supported in this browser');
      }
  
      this.dbName = dbName;
      this.storeName = storeName;
      this.db = null;
      this.isOpening = false;
      this.openRequests = [];
    }
  
    async open() {
      // 如果数据库已经在打开过程中，返回同一个Promise
      if (this.isOpening) {
        return new Promise((resolve, reject) => {
          this.openRequests.push({ resolve, reject });
        });
      }
  
      this.isOpening = true;
  
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
  
        request.onerror = (event) => {
          this.isOpening = false;
          const error = new Error(`Failed to open database: ${event.target.error}`);
          error.name = 'DatabaseOpenError';
          reject(error);
          this._rejectOpenRequests(error);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          try {
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName, { keyPath: 'id' });
            }
          } catch (e) {
            event.target.transaction.abort();
            const error = new Error(`Failed to upgrade database: ${e.message}`);
            error.name = 'DatabaseUpgradeError';
            reject(error);
            this._rejectOpenRequests(error);
          }
        };
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          this.isOpening = false;
          
          // 处理数据库关闭和版本变更
          this.db.onversionchange = () => {
            this.db.close();
            console.warn('Database is outdated, please reload the page');
          };
          
          this.db.onclose = () => {
            console.warn('Database connection was closed');
            this.db = null;
          };
  
          resolve(this.db);
          this._resolveOpenRequests(this.db);
        };
  
        request.onblocked = () => {
          this.isOpening = false;
          const error = new Error('Database is blocked, likely open in another tab');
          error.name = 'DatabaseBlockedError';
          reject(error);
          this._rejectOpenRequests(error);
        };
      });
    }
  
    _resolveOpenRequests(db) {
      while (this.openRequests.length > 0) {
        const { resolve } = this.openRequests.pop();
        resolve(db);
      }
    }
  
    _rejectOpenRequests(error) {
      while (this.openRequests.length > 0) {
        const { reject } = this.openRequests.pop();
        reject(error);
      }
    }
  
    async _validateKey(key) {
      if (key === undefined || key === null) {
        throw new Error('Key must not be null or undefined');
      }
      if (typeof key !== 'string' && typeof key !== 'number') {
        throw new Error('Key must be a string or number');
      }
    }
  
    async get(key) {
      try {
        await this._validateKey(key);
        
        if (!this.db) {
          await this.open();
        }
  
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(this.storeName, 'readonly');
          
          transaction.onerror = (event) => {
            const error = new Error(`Transaction failed: ${event.target.error}`);
            error.name = 'TransactionError';
            reject(error);
          };
          
          transaction.onabort = (event) => {
            const error = new Error(`Transaction aborted: ${event.target.error}`);
            error.name = 'TransactionAbortError';
            reject(error);
          };
  
          const store = transaction.objectStore(this.storeName);
          const request = store.get(key);
          
          request.onerror = (event) => {
            const error = new Error(`Get operation failed: ${event.target.error}`);
            error.name = 'GetOperationError';
            reject(error);
          };
          
          request.onsuccess = (event) => {
            resolve(event.target.result?.data);
          };
        });
      } catch (error) {
        console.error('Error in get operation:', error);
        throw error; // 重新抛出以便调用者可以处理
      }
    }
  
    async set(key, value) {
      try {
        await this._validateKey(key);
        
        if (value === undefined || value === null) {
          throw new Error('Value must not be null or undefined');
        }
  
        if (!this.db) {
          await this.open();
        }
  
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(this.storeName, 'readwrite');
          
          transaction.onerror = (event) => {
            const error = new Error(`Transaction failed: ${event.target.error}`);
            error.name = 'TransactionError';
            reject(error);
          };
          
          transaction.onabort = (event) => {
            const error = new Error(`Transaction aborted: ${event.target.error}`);
            error.name = 'TransactionAbortError';
            reject(error);
          };
  
          const store = transaction.objectStore(this.storeName);
          const request = store.put({ id: key, data: value });
          
          request.onerror = (event) => {
            const error = new Error(`Set operation failed: ${event.target.error}`);
            error.name = 'SetOperationError';
            reject(error);
          };
          
          request.onsuccess = () => {
            resolve();
          };
        });
      } catch (error) {
        console.error('Error in set operation:', error);
        throw error;
      }
    }
  
    async delete(key) {
      try {
        await this._validateKey(key);
        
        if (!this.db) {
          await this.open();
        }
  
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(this.storeName, 'readwrite');
          
          transaction.onerror = (event) => {
            const error = new Error(`Transaction failed: ${event.target.error}`);
            error.name = 'TransactionError';
            reject(error);
          };
          
          transaction.onabort = (event) => {
            const error = new Error(`Transaction aborted: ${event.target.error}`);
            error.name = 'TransactionAbortError';
            reject(error);
          };
  
          const store = transaction.objectStore(this.storeName);
          const request = store.delete(key);
          
          request.onerror = (event) => {
            const error = new Error(`Delete operation failed: ${event.target.error}`);
            error.name = 'DeleteOperationError';
            reject(error);
          };
          
          request.onsuccess = () => {
            resolve();
          };
        });
      } catch (error) {
        console.error('Error in delete operation:', error);
        throw error;
      }
    }
  
    async clear() {
      try {
        if (!this.db) {
          await this.open();
        }
  
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(this.storeName, 'readwrite');
          
          transaction.onerror = (event) => {
            const error = new Error(`Transaction failed: ${event.target.error}`);
            error.name = 'TransactionError';
            reject(error);
          };
          
          transaction.onabort = (event) => {
            const error = new Error(`Transaction aborted: ${event.target.error}`);
            error.name = 'TransactionAbortError';
            reject(error);
          };
  
          const store = transaction.objectStore(this.storeName);
          const request = store.clear();
          
          request.onerror = (event) => {
            const error = new Error(`Clear operation failed: ${event.target.error}`);
            error.name = 'ClearOperationError';
            reject(error);
          };
          
          request.onsuccess = () => {
            resolve();
          };
        });
      } catch (error) {
        console.error('Error in clear operation:', error);
        throw error;
      }
    }
  }
  
  // 创建并导出单例实例
  const imageDB = new ImageDB();
  
  // 导出带有错误处理的方法
  export const getImage = async (key) => {
    try {
      await imageDB.open();
      return await imageDB.get(key);
    } catch (error) {
      console.error('Failed to get image:', error);
      throw error; // 可以选择不重新抛出，根据业务需求决定
    }
  };
  
  export const setImage = async (key, value) => {
    try {
      await imageDB.open();
      return await imageDB.set(key, value);
    } catch (error) {
      console.error('Failed to set image:', error);
      throw error;
    }
  };
  
  export const deleteImage = async (key) => {
    try {
      await imageDB.open();
      return await imageDB.delete(key);
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  };
  
  export const clearImageDB = async () => {
    try {
      await imageDB.open();
      return await imageDB.clear();
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw error;
    }
  };
  
  // 导出错误类型供外部检查
  export const ImageDBErrorTypes = {
    DatabaseOpenError: 'DatabaseOpenError',
    DatabaseUpgradeError: 'DatabaseUpgradeError',
    DatabaseBlockedError: 'DatabaseBlockedError',
    TransactionError: 'TransactionError',
    TransactionAbortError: 'TransactionAbortError',
    GetOperationError: 'GetOperationError',
    SetOperationError: 'SetOperationError',
    DeleteOperationError: 'DeleteOperationError',
    ClearOperationError: 'ClearOperationError'
  };