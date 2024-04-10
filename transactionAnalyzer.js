/**
 * Класс для обработки транзакций
 */
class TransactionAnalyzer {
    /**
     * Констрктор класса
     * @param {Object[]} transactions Все транзакции
     */
    constructor(transactions) {
      this.transactions = transactions;
    }
    
    /**
     * Добавляет новую транзакцию в массив
     * @param {Object} transaction Объект транзакции
     */
    addTransaction(transaction) {
      this.transactions.push(transaction);
    }
    
    /**
     * Возвращает массив всех транзакций
     * @returns {Object[]} Массив всех транзакций
     */
    getAllTransactions() {
      return this.transactions;
    }

    /**
     * Возвращает массив всевозможных типов транзакций
     * @returns {string[]} Массив всевозможных типов транзакций
     */
    getUniqueTransactionType() {
        let allTransactionTypes = this.transactions.map( item => item.transaction_type);
        return Array.from(new Set(allTransactionTypes));
    }

    /**
     * Рассчитывает общую сумму всех транзакций
     * @returns {number} Общая сумма всех транзакций
     */
    calculateTotalAmount() {
        return this.transactions.reduce( (accumulator, item) => {
            return accumulator + item.transaction_amount;
        }, 0)
    }

    /**
     * Вычисляет общую сумму транзакций за указанный год, месяц и день
     * @param {string} year Год
     * @param {string} month Месяц
     * @param {string} day День
     * @returns {number} Сумма транзакций за указанный год, месяц и день
     */
    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.reduce( (accumulator, item) => {
            const [transactionYear, transactionMonth, transactionDay] = item.transaction_date.split('-');
            const isSameYear = !year || transactionYear === year;
            const isSameMonth = !month || transactionMonth === month;
            const isSameDay = !day || transactionDay === day;

            let transactionAmount = (isSameYear && isSameMonth && isSameDay) ? item.transaction_amount : 0;
            return accumulator + transactionAmount;
        }, 0)
    }

    /**
     * Возвращает транзакции указанного типа
     * @param {string} type Тип транзакии
     * @returns {Object[]} Маcсив транзаций указанного типа
     */
    getTransactionByType(type) {
        return this.transactions.filter((item) => {
            return item.transaction_type === type
        })
    }

    /**
     * Возвращает транзакции, проведенные в указанном диапазоне дат от startDate до endDate
     * @param {string} startDate 
     * @param {string} endDate 
     * @returns {Object[]} Массив транзакций проведенных в указанном диапазоне дат
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(item => {
          const transactionDate = new Date(item.transaction_date);
          return transactionDate >= start && transactionDate <= end;
        });
      }

      /**
       * Возвращает транзакции, совершенные с указанным торговым местом или компанией
       * @param {string} merchantName 
       * @returns {Object[]} транзакции, совершенные с указанным торговым местом или компанией
       */
      getTransactionsByMerchant(merchantName) {
        return this.transactions.filter((item) => {
            return item.merchant_name === merchantName
        })
      }
      /**
       * Возвращает среднее значение транзакций
       * @returns {number} среднее значение транзакций
       */
      calculateAverageTransactionAmount() {
        const numOfTransactions = this.transactions.length
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / numOfTransactions;
      }

      /**
       * Возвращает транзакции с суммой в заданном диапазоне от minAmount до maxAmount
       * @param {number} minAmount 
       * @param {number} maxAmount 
       * @returns {Object[]} транзакции с суммой в заданном диапазоне
       */
      getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(item =>
            item.transaction_amount >= minAmount && item.transaction_amount <= maxAmount
          );
      }

      /**
       * Вычисляет общую сумму дебетовых транзакции
       * @returns {number} общая сумма дебетовых транзакций
       */
      calculateTotalDebitAmount() {
        return this.transactions.reduce((total, item) => {
            const transactionAmount = item.transaction_type === 'debit' ? item.transaction_amount : 0;
            return total + transactionAmount;
        }, 0);
      }

      /**
       * Возвращает месяц, в котором было больше всего транзакций
       * @returns {number} номер месяца, в котором было больше всего транзакций
       */
      findMostTransactionsMonth() {
        const monthCount = this.transactions.reduce((count, item) => {
            const month = new Date(item.transaction_date).getMonth();
            count[month] = (count[month] || 0) + 1;
            return count;
          }, {});
      
          let mostTransactions = 0;
          let mostTransactionsMonth = -1;
      
          for (let month in monthCount) {
            if (monthCount[month] > mostTransactions) {
              mostTransactions = monthCount[month];
              mostTransactionsMonth = month;
            }
          }
      
          return mostTransactionsMonth + 1;
        }

        /**
         * Возвращает месяц, в котором было больше дебетовых транзакций
         * @returns {number} номер месяца, в котором было больше дебетовых транзакций
         */
        findMostDebitTransactionMonth() {
            const monthCount = this.transactions.reduce((count, item) => {
                const month = new Date(item.transaction_date).getMonth();
                if (item.transaction_type === 'debit') {
                    count[month] = (count[month] || 0) + 1;
                }
                return count;
              }, {});
          
              let mostTransactions = 0;
              let mostTransactionsMonth = -1;
          
              for (let month in monthCount) {
                if (monthCount[month] > mostTransactions) {
                  mostTransactions = monthCount[month];
                  mostTransactionsMonth = month;
                }
              }
          
              return mostTransactionsMonth + 1;            
        }

        /**
         * Возвращает каких транзакций больше всего
         * @returns {string} Тип транзакций которых больше всего
         */
        mostTransactionTypes() {
            let debitCount = 0;
            let creditCount = 0;
        
            this.transactions.forEach(item => {
              if (item.transaction_type === 'debit') {
                debitCount += 1;
              } else if (item.transaction_type === 'credit') {
                creditCount += 1;
              }
            });
        
            if (debitCount > creditCount) {
              return 'debit';
            } else if (creditCount > debitCount) {
              return 'credit';
            } else {
              return 'equal';
            }
          }
          
          /**
           * Возвращает транзакции, совершенные до указанной даты
           * @param {string} date 
           * @returns {Object[]} транзакции, совершенные до указанной даты
           */
          getTransactionsBeforeDate(date) {
            const specifiedDate = new Date(date);
            return this.transactions.filter(item => {
              const transactionDate = new Date(item.transaction_date);
              return transactionDate < specifiedDate;
            });
          }

          /**
           * Возвращает транзакцию по ее уникальному идентификатору
           * @param {string} id 
           * @returns {Object} транзакция по ее уникальному идентификатору
           */
          findTransactionById(id) {
            return this.transactions.find(item => item.transaction_id === id);
          }

          /**
           * Возвращает новый массив, содержащий только описания транзакций
           * @returns {Object[]} новый массив, содержащий только описания транзакций
           */
          mapTransactionDescriptions() {
            return this.transactions.map(item => item.transaction_description);
          }
}
  
module.exports = TransactionAnalyzer;
