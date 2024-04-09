const readline = require('readline');
const TransactionAnalyzer = require('./transactionAnalyzer.js');
const transactionsData = require('./transactions.json');

// Загрузка данных транзакций
const analyzer = new TransactionAnalyzer(transactionsData);

// Создание интерфейса readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rerenderMenu = () => {
    rl.question('Нажмите ENTER для продолжения...', () => {
        showMenu();
    })
}

// Функция для отображения меню и обработки выбора пользователя
function showMenu() {
    console.clear()
    console.log(`
  Выберите действие:
  1. Показать все транзакции
  2. Получить уникальные типы транзакций
  3. Рассчитать общую сумму транзакций
  4. Рассчитать общую сумму транзакций по дате
  5. Получить транзакции по типу
  6. Получить транзакции в диапазоне дат
  7. Получить транзакции по торговому месту
  8. Рассчитать среднюю сумму транзакций
  9. Получить транзакции по диапазону сумм
  10. Рассчитать общую сумму дебетовых транзакций
  11. Найти месяц с наибольшим количеством транзакций
  12. Найти месяц с наибольшим количеством дебетовых транзакций
  13. Определить, каких транзакций больше всего
  14. Получить транзакции до указанной даты
  15. Найти транзакцию по ID
  16. Получить описания всех транзакций
  17. Выход
  `);

    rl.question('Введите номер действия: ', (answer) => {
        switch (answer) {
            case '1':
                console.log("Все транзакции:", analyzer.getAllTransactions());
                break;
            case '2':
                console.log("Уникальные типы транзакций:", analyzer.getUniqueTransactionType());
                break;
            case '3':
                console.log("Общая сумма транзакций:", analyzer.calculateTotalAmount());
                break;
            case '4':
                rl.question('Введите дату в формате ГГГГ-ММ-ДД: ', (dateInput) => {
                    const [year, month, day] = dateInput.split('-');
                    const totalAmount = analyzer.calculateTotalAmountByDate(year, month, day);
                    console.log(`Общая сумма транзакций за ${dateInput}:`, totalAmount);
                    rerenderMenu();
                });
                break;
            case '5':
                rl.question('Введите тип транзакции (debit или credit): ', (type) => {
                    const transactionsByType = analyzer.getTransactionByType(type);
                    console.log(`Транзакции типа "${type}":`, transactionsByType);
                    rerenderMenu();
                });
                break;

            case '6':
                rl.question('Введите начальную дату в формате ГГГГ-ММ-ДД: ', (startDate) => {
                    rl.question('Введите конечную дату в формате ГГГГ-ММ-ДД: ', (endDate) => {
                        const transactionsInRange = analyzer.getTransactionsInDateRange(startDate, endDate);
                        console.log(`Транзакции с ${startDate} по ${endDate}:`, transactionsInRange);
                        rerenderMenu();
                    });
                });
                break;

            case '7':
                rl.question('Введите название торгового места: ', (merchantName) => {
                    const transactionsByMerchant = analyzer.getTransactionsByMerchant(merchantName);
                    console.log(`Транзакции совершенные в "${merchantName}":`, transactionsByMerchant);
                    rerenderMenu();
                });
                break;

            case '8':
                const averageAmount = analyzer.calculateAverageTransactionAmount();
                console.log(`Средняя сумма транзакций:`, averageAmount);
                break;

            case '9':
                rl.question('Введите минимальную сумму транзакции: ', (minAmount) => {
                    rl.question('Введите максимальную сумму транзакции: ', (maxAmount) => {
                        const transactionsByAmountRange = analyzer.getTransactionsByAmountRange(parseFloat(minAmount), parseFloat(maxAmount));
                        console.log(`Транзакции в диапазоне сумм от ${minAmount} до ${maxAmount}:`, transactionsByAmountRange);
                        rerenderMenu();
                    });
                });
                break;
            case '10':
                const totalDebitAmount = analyzer.calculateTotalDebitAmount();
                console.log(`Общая сумма дебетовых транзакций:`, totalDebitAmount);
                break;

            case '11':
                const mostTransactionsMonth = analyzer.findMostTransactionsMonth();
                console.log(`Месяц с наибольшим количеством транзакций: ${mostTransactionsMonth}`);
                break;

            case '12':
                const mostDebitTransactionsMonth = analyzer.findMostDebitTransactionMonth();
                console.log(`Месяц с наибольшим количеством дебетовых транзакций: ${mostDebitTransactionsMonth}`);
                break;

            case '13':
                const mostTransactionType = analyzer.mostTransactionTypes();
                console.log(`Больше всего транзакций типа: ${mostTransactionType}`);
                break;

            case '14':
                rl.question('Введите дату в формате ГГГГ-ММ-ДД для получения транзакций до этой даты: ', (date) => {
                    const transactionsBeforeDate = analyzer.getTransactionsBeforeDate(date);
                    console.log(`Транзакции, совершенные до ${date}:`, transactionsBeforeDate);
                    rerenderMenu();
                });
                break;

            case '15':
                rl.question('Введите идентификатор транзакции: ', (id) => {
                    const transactionById = analyzer.findTransactionById(id);
                    if (transactionById) {
                        console.log(`Транзакция с ID ${id}:`, transactionById);
                    } else {
                        console.log(`Транзакция с ID ${id} не найдена.`);
                    }
                    rerenderMenu();
                });
                break;

            case '16':
                const descriptions = analyzer.mapTransactionDescriptions();
                console.log(`Описания всех транзакций:`, descriptions);
                break;

            case '17':
                console.log('Завершение работы программы.');
                rl.close();
                break;

            default:
                console.log("Некорректный ввод. Пожалуйста, введите номер действия.");
        }

        rerenderMenu();
    });
}

// Запуск меню
showMenu();

// Закрытие readline при выходе
rl.on('close', () => {
    console.log('Завершение работы программы');
    process.exit(0);
});
