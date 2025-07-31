import React, { useState, useRef } from 'react';
import { 
  Database, 
  Upload, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Zap, 
  Eye, 
  X, 
  ChevronRight, 
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Play
} from 'lucide-react';

const VendingDBManager = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [dbCreated, setDbCreated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDataTab, setActiveDataTab] = useState('unified');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(25);
  const fileInputRef = useRef(null);

  // Генерация тестовых данных с правильными ценами
  const generateSampleData = () => {
    const machines = ['a7ca181f0000', 'b8db292g0001', 'c9ec303h0002', 'd0fd414i0003'];
    const goods = ['Hot Chocolate', 'Coffee Espresso', 'Tea Green', 'Cappuccino', 'Latte'];
    const addresses = ['кудрат первушка', 'центр ташкент', 'юнусабад район', 'мирзо-улугбек'];
    
    // Реальные цены в сумах (Узбекистан)
    const prices = [15000, 18000, 12000, 20000, 25000, 14000, 16000, 22000];
    
    return Array.from({ length: 150 }, (_, i) => {
      const orderNumber = `ff0000${(25520250701025853 + i).toString(16)}`;
      const machineCode = machines[i % machines.length];
      const price = prices[i % prices.length];
      const creationTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return {
        // Unified Orders
        unified: {
          id: i + 1,
          order_number: orderNumber,
          machine_code: machineCode,
          address: addresses[i % addresses.length],
          goods_name: goods[i % goods.length],
          order_price: price,
          creation_time: creationTime,
          payment_status: Math.random() > 0.1 ? 'Paid' : 'Refunded',
          brew_status: Math.random() > 0.05 ? 'Delivered' : 'Not delivered',
          match_score: Math.floor(Math.random() * 6) + 1,
          data_sources: ['hardware', 'sales', 'fiscal'].slice(0, Math.floor(Math.random() * 3) + 1)
        },
        
        // Hardware Orders
        hardware: Math.random() > 0.1 ? {
          id: i + 1,
          order_number: orderNumber,
          machine_code: machineCode,
          address: addresses[i % addresses.length],
          goods_name: goods[i % goods.length],
          taste_name: goods[i % goods.length],
          order_type: 'Normal order',
          order_price: price,
          order_resource: Math.random() > 0.7 ? 'Custom payment' : 'Cash payment',
          payment_status: Math.random() > 0.1 ? 'Paid' : 'Refunded',
          brew_status: Math.random() > 0.05 ? 'Delivered' : 'Not delivered',
          creation_time: creationTime,
          paying_time: new Date(creationTime.getTime() + 2000),
          brewing_time: new Date(creationTime.getTime() + 5000),
          delivery_time: new Date(creationTime.getTime() + 45000)
        } : null,
        
        // Sales Reports - цена может немного отличаться
        sales: Math.random() > 0.2 ? {
          id: i + 1,
          order_number: orderNumber,
          report_id: 8774 + i,
          formatted_time: creationTime,
          goods_id: 380 + (i % 50),
          goods_name: goods[i % goods.length],
          order_price: price + (Math.random() > 0.8 ? Math.floor(Math.random() * 1000) : 0), // Иногда расхождение в цене
          ikpu_code: '2202004001000000',
          order_resource: 'cash',
          payment_type: 'Наличные',
          machine_code: machineCode,
          username: 'Не определен',
          accrued_bonus: 0
        } : null,
        
        // Fiscal Receipts - может быть расхождение в суммах
        fiscal: Math.random() > 0.3 ? {
          id: i + 1,
          receipt_number: (885 + i).toString(),
          fiscal_module: 'LG420230630322',
          operation_type: 'Продажа',
          cashier: 'VendiHub Online',
          operation_amount: price + (Math.random() > 0.9 ? 100 : 0), // Редкие расхождения
          cash_amount: price,
          card_amount: 0,
          operation_datetime: creationTime,
          matched_order_number: orderNumber
        } : null,
        
        // Payme Payments - обычно больше из-за комиссий
        payme: Math.random() > 0.6 ? {
          id: i + 1,
          payment_system_id: `684fc2aeedb85b85cd0f099${i.toString(16)}`,
          provider_name: 'HUB',
          payment_state: 'ОПЛАЧЕНО',
          payment_time: creationTime,
          amount_without_commission: price,
          client_commission: Math.floor(price * 0.02), // 2% комиссия
          processing_name: 'UZCARD',
          card_number: '860033******4372',
          matched_order_number: orderNumber
        } : null,
        
        // Click Payments
        click: Math.random() > 0.7 ? {
          id: i + 1,
          click_id: (4207054231 + i).toString(),
          service_name: 'Vendhub',
          client_info: '99893***5666',
          amount: price,
          payment_status: 'Успешно подтвержден',
          payment_date: creationTime,
          matched_order_number: orderNumber
        } : null,
        
        // Uzum Payments
        uzum: Math.random() > 0.8 ? {
          id: i + 1,
          receipt_id: `a3f666d9-4abf-4b15-ae55-b5b59881b8${i.toString(16).padStart(2, '0')}`,
          service_name: 'Кофейный вендинговый аппарат',
          amount: price,
          commission: Math.floor(price * 0.015), // 1.5% комиссия
          card_type: 'UZCARD',
          status: 'SUCCESS',
          parsed_datetime: creationTime,
          matched_order_number: orderNumber
        } : null
      };
    });
  };

  const [sampleData] = useState(generateSampleData());

  // Структура базы данных
  const dbTables = [
    { name: 'hardware_orders', description: 'Основные заказы (HW.xlsx)', status: 'pending', records: 0 },
    { name: 'sales_reports', description: 'VendHub отчеты (report.xlsx)', status: 'pending', records: 0 },
    { name: 'fiscal_receipts', description: 'Фискальные чеки', status: 'pending', records: 0 },
    { name: 'payme_payments', description: 'Платежи Payme', status: 'pending', records: 0 },
    { name: 'click_payments', description: 'Платежи Click', status: 'pending', records: 0 },
    { name: 'uzum_payments', description: 'Платежи Uzum/Liuzon', status: 'pending', records: 0 },
    { name: 'files', description: 'Управление файлами', status: 'pending', records: 0 },
    { name: 'unified_orders', description: 'Объединенные заказы', status: 'pending', records: 0 },
    { name: 'order_changes', description: 'История изменений', status: 'pending', records: 0 },
    { name: 'order_errors', description: 'Ошибки и конфликты', status: 'pending', records: 0 }
  ];

  const [tables, setTables] = useState(dbTables);

  // Создание базы данных
  const createDatabase = async () => {
    setProcessing(true);
    addLog('🚀 Начинаем создание структуры базы данных...', 'info');
    
    // Симуляция создания таблиц
    for (let i = 0; i < tables.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTables(prev => prev.map((table, index) => 
        index === i ? { ...table, status: 'created' } : table
      ));
      addLog(`✅ Создана таблица: ${tables[i].name}`, 'success');
    }
    
    addLog('🎯 Создание индексов и связей...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('⚡ Инициализация функций сопоставления...', 'info');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Заполняем тестовыми данными
    const counts = {
      unified_orders: sampleData.length,
      hardware_orders: sampleData.filter(d => d.hardware).length,
      sales_reports: sampleData.filter(d => d.sales).length,
      fiscal_receipts: sampleData.filter(d => d.fiscal).length,
      payme_payments: sampleData.filter(d => d.payme).length,
      click_payments: sampleData.filter(d => d.click).length,
      uzum_payments: sampleData.filter(d => d.uzum).length
    };
    
    setTables(prev => prev.map(table => ({
      ...table,
      status: 'populated',
      records: counts[table.name] || Math.floor(Math.random() * 50)
    })));
    
    addLog('🏁 База данных успешно создана и заполнена тестовыми данными!', 'success');
    setDbCreated(true);
    setProcessing(false);
    generateAnalytics();
  };

  // Обработка загрузки файлов
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const uploadedFiles = Array.from(event.target.files);
    setUploading(true);
    
    for (const file of uploadedFiles) {
      addLog(`📁 Загружается файл: ${file.name}`, 'info');
      
      // Симуляция обработки файла
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileType = detectFileType(file.name);
      const processedFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: fileType,
        size: file.size,
        status: 'processed',
        records: Math.floor(Math.random() * 1000) + 100,
        matched: Math.floor(Math.random() * 800) + 50,
        errors: Math.floor(Math.random() * 10)
      };
      
      setFiles(prev => [...prev, processedFile]);
      
      // Обновляем статистику таблиц
      setTables(prev => prev.map(table => 
        table.name === getTableForFileType(fileType) 
          ? { ...table, records: table.records + processedFile.records, status: 'populated' }
          : table
      ));
      
      addLog(`✅ Обработан файл: ${file.name} (${processedFile.records} записей)`, 'success');
    }
    
    setUploading(false);
    generateAnalytics();
  };

  // Определение типа файла
  const detectFileType = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('hw') || name.includes('hardware')) return 'hardware';
    if (name.includes('report')) return 'sales';
    if (name.includes('fiscal')) return 'fiscal';
    if (name.includes('payme')) return 'payme';
    if (name.includes('click')) return 'click';
    if (name.includes('uzum')) return 'uzum';
    return 'unknown';
  };

  // Получение таблицы для типа файла
  const getTableForFileType = (type) => {
    const mapping = {
      'hardware': 'hardware_orders',
      'sales': 'sales_reports',
      'fiscal': 'fiscal_receipts',
      'payme': 'payme_payments',
      'click': 'click_payments',
      'uzum': 'uzum_payments'
    };
    return mapping[type] || 'files';
  };

  // Генерация аналитики с анализом расхождений цен
  const generateAnalytics = () => {
    const totalOrders = tables.find(t => t.name === 'unified_orders')?.records || 0;
    const totalMatched = Math.floor(totalOrders * 0.85);
    
    // Анализ расхождений в ценах
    let priceDiscrepancies = 0;
    sampleData.forEach(d => {
      const basePrice = d.unified.order_price;
      
      // Проверяем расхождения с sales reports
      if (d.sales && Math.abs(d.sales.order_price - basePrice) > 500) {
        priceDiscrepancies++;
      }
      
      // Проверяем расхождения с fiscal receipts
      if (d.fiscal && Math.abs(d.fiscal.operation_amount - basePrice) > 100) {
        priceDiscrepancies++;
      }
    });
    
    // Подсчитываем уникальные автоматы по machine_code
    const uniqueMachines = new Set(
      sampleData
        .map(d => d.unified.machine_code)
        .filter(Boolean)
    );
    
    // Подсчитываем общую выручку
    const totalRevenue = sampleData.reduce((sum, d) => sum + (d.unified.order_price || 0), 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;
    
    setAnalytics({
      totalOrders,
      totalMatched,
      totalErrors: priceDiscrepancies,
      matchRate: totalOrders > 0 ? ((totalMatched / totalOrders) * 100).toFixed(1) : 0,
      machines: uniqueMachines.size,
      revenue: totalRevenue.toLocaleString(),
      avgOrderValue: avgOrderValue,
      priceDiscrepancies
    });
  };

  // Добавление лога
  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Очистка логов
  const clearLogs = () => {
    setLogs([]);
    addLog('Логи очищены', 'info');
  };

  // Открытие детального просмотра записи
  const openRecordDetails = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  // Фильтрация данных по поисковому запросу
  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Получение данных для выбранной таблицы
  const getTableData = (tableName) => {
    switch (tableName) {
      case 'unified':
        return sampleData.map(d => d.unified);
      case 'hardware':
        return sampleData.map(d => d.hardware).filter(Boolean);
      case 'sales':
        return sampleData.map(d => d.sales).filter(Boolean);
      case 'fiscal':
        return sampleData.map(d => d.fiscal).filter(Boolean);
      case 'payme':
        return sampleData.map(d => d.payme).filter(Boolean);
      case 'click':
        return sampleData.map(d => d.click).filter(Boolean);
      case 'uzum':
        return sampleData.map(d => d.uzum).filter(Boolean);
      default:
        return [];
    }
  };

  // Пагинация данных
  const getPaginatedData = (data) => {
    const filteredData = filterData(data, searchTerm);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalRecords: filteredData.length,
      totalPages: Math.ceil(filteredData.length / recordsPerPage)
    };
  };

  // Переход на страницу
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Сброс страницы при смене таблицы или поиска
  const handleTabChange = (tab) => {
    setActiveDataTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Компонент статистики в стиле VendHub
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'orange', onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer transform hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Компонент пагинации
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between bg-white px-6 py-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          Страница {currentPage} из {totalPages}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Компонент таблицы данных с пагинацией
  const DataTable = ({ data, tableName }) => {
    const paginatedResult = getPaginatedData(data);
    const { data: paginatedData, totalRecords, totalPages } = paginatedResult;
    
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12">
          <Database className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-lg text-gray-500">Нет данных для отображения</p>
        </div>
      );
    }

    const columns = Object.keys(data[0] || {});
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-orange-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {tableName.charAt(0).toUpperCase() + tableName.slice(1)} данные
            </h3>
            <span className="text-sm text-gray-600">
              Показано {paginatedData.length} из {totalRecords} записей
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.slice(0, 8).map((column) => (
                  <th key={column} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-orange-25 transition-colors duration-150">
                  {columns.slice(0, 8).map((column) => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof row[column] === 'object' && row[column] instanceof Date 
                        ? row[column].toLocaleString() 
                        : typeof row[column] === 'object' 
                        ? JSON.stringify(row[column]).slice(0, 50) + '...'
                        : String(row[column] || '').slice(0, 50)
                      }
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => openRecordDetails(row)}
                      className="text-orange-600 hover:text-orange-900 font-medium"
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header в стиле VendHub */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  VendHub DB Manager
                </h1>
                <p className="text-sm text-orange-600 font-medium">
                  Система управления БД торговых автоматов
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                dbCreated 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {dbCreated ? '✅ БД активна' : '⏳ БД не создана'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation в стиле VendHub */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { id: 'database', name: 'База данных', icon: Database },
              { id: 'data', name: 'Просмотр данных', icon: Eye },
              { id: 'upload', name: 'Загрузка файлов', icon: Upload },
              { id: 'analytics', name: 'Аналитика', icon: BarChart3 },
              { id: 'logs', name: 'Логи системы', icon: FileText }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-6 font-semibold text-sm transition-all duration-200 border-b-3 ${
                  activeTab === id
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-orange-25'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Структура базы данных</h2>
                <p className="text-gray-600 mt-1">Управление таблицами и структурой данных</p>
              </div>
              <button
                onClick={createDatabase}
                disabled={dbCreated || processing}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  dbCreated 
                    ? 'bg-green-100 text-green-800 cursor-not-allowed border-2 border-green-200'
                    : processing
                    ? 'bg-orange-100 text-orange-800 cursor-not-allowed border-2 border-orange-200'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Создание БД...</span>
                  </>
                ) : dbCreated ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>База создана</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Создать БД</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tables.map((table, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{table.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      table.status === 'created' || table.status === 'populated'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {table.status === 'pending' && '⏳ Ожидание'}
                      {table.status === 'created' && '✅ Создана'}
                      {table.status === 'populated' && '🗃️ Заполнена'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{table.description}</p>
                  {table.records > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Записей в таблице:</span>
                      <button 
                        className="text-lg font-bold text-orange-600 hover:text-orange-800 transition-colors duration-150 flex items-center space-x-1"
                        onClick={() => {
                          setActiveTab('data');
                          handleTabChange(table.name.replace('_orders', '').replace('_reports', '').replace('_receipts', '').replace('_payments', ''));
                        }}
                      >
                        <span>{table.records.toLocaleString()}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Viewing Tab */}
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Просмотр данных</h2>
                <p className="text-gray-600 mt-1">Детальный анализ записей по всем таблицам</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по всем данным..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-12 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {!dbCreated && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Внимание!</h3>
                    <p className="text-yellow-700 mt-1">
                      Сначала необходимо создать структуру базы данных на вкладке "База данных"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {dbCreated && (
              <>
                {/* Data Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 bg-gray-50">
                    <nav className="flex space-x-1 px-6">
                      {[
                        { id: 'unified', name: 'Объединенные заказы', count: sampleData.length, icon: '🔗' },
                        { id: 'hardware', name: 'Hardware Orders', count: sampleData.filter(d => d.hardware).length, icon: '⚙️' },
                        { id: 'sales', name: 'Sales Reports', count: sampleData.filter(d => d.sales).length, icon: '📊' },
                        { id: 'fiscal', name: 'Fiscal Receipts', count: sampleData.filter(d => d.fiscal).length, icon: '🧾' },
                        { id: 'payme', name: 'Payme', count: sampleData.filter(d => d.payme).length, icon: '💳' },
                        { id: 'click', name: 'Click', count: sampleData.filter(d => d.click).length, icon: '📱' },
                        { id: 'uzum', name: 'Uzum', count: sampleData.filter(d => d.uzum).length, icon: '🟣' }
                      ].map(({ id, name, count, icon }) => (
                        <button
                          key={id}
                          onClick={() => handleTabChange(id)}
                          className={`py-4 px-4 border-b-3 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                            activeDataTab === id
                              ? 'border-orange-500 text-orange-600 bg-white'
                              : 'border-transparent text-gray-600 hover:text-orange-600 hover:border-orange-300'
                          }`}
                        >
                          <span>{icon}</span>
                          <span>{name}</span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                            {count}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Data Table */}
                  <div className="p-6">
                    <DataTable 
                      data={getTableData(activeDataTab)} 
                      tableName={activeDataTab}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Загрузка файлов</h2>
              <p className="text-gray-600 mt-1">Импорт данных из Excel и CSV файлов</p>
            </div>

            {!dbCreated && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Внимание!</h3>
                    <p className="text-yellow-700 mt-1">
                      Сначала необходимо создать структуру базы данных
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-orange-300 p-12 text-center hover:border-orange-400 transition-colors duration-200">
              <Upload className="mx-auto h-16 w-16 text-orange-400 mb-4" />
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-xl font-semibold text-gray-900 block mb-2">
                    Перетащите файлы сюда или нажмите для выбора
                  </span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={!dbCreated || uploading}
                  />
                </label>
                <p className="text-gray-500 mb-4">
                  Поддерживаются: Excel (.xlsx, .xls), CSV файлы
                </p>
                {(uploading || !dbCreated) && (
                  <p className="text-sm text-orange-600 font-medium">
                    {uploading ? '⏳ Загрузка файлов...' : '⚠️ Создайте БД для загрузки файлов'}
                  </p>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-orange-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Загруженные файлы</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <div key={file.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.type} • Обработан
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <button 
                            className="text-lg font-bold text-orange-600 hover:text-orange-800 transition-colors duration-150 flex items-center space-x-1"
                            onClick={() => {
                              setActiveTab('data');
                              handleTabChange(getTableForFileType(file.type).replace('_orders', '').replace('_reports', '').replace('_receipts', '').replace('_payments', ''));
                            }}
                          >
                            <span>{file.records} записей</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <p className="text-sm text-green-600 font-medium">
                            ✅ {file.matched} сопоставлено
                          </p>
                          {file.errors > 0 && (
                            <p className="text-sm text-red-600 font-medium">
                              ⚠️ {file.errors} ошибок
                            </p>
                          )}
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Аналитика данных</h2>
              <p className="text-gray-600 mt-1">Подробная статистика и анализ системы</p>
            </div>

            {analytics ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={TrendingUp}
                    title="Всего заказов"
                    value={analytics.totalOrders.toLocaleString()}
                    subtitle="за весь период"
                    color="orange"
                    onClick={() => {
                      setActiveTab('data');
                      handleTabChange('unified');
                    }}
                  />
                  <StatCard
                    icon={CheckCircle}
                    title="Сопоставлено"
                    value={`${analytics.matchRate}%`}
                    subtitle={`${analytics.totalMatched.toLocaleString()} заказов`}
                    color="green"
                    onClick={() => {
                      setActiveTab('data');
                      handleTabChange('unified');
                      handleSearchChange('match_score');
                    }}
                  />
                  <StatCard
                    icon={Users}
                    title="Автоматы"
                    value={analytics.machines}
                    subtitle="активных точек"
                    color="purple"
                    onClick={() => {
                      setActiveTab('data');
                      handleTabChange('unified');
                      const uniqueMachines = [...new Set(
                        sampleData.map(d => d.unified.machine_code).filter(Boolean)
                      )];
                      handleSearchChange(uniqueMachines[0] || 'machine_code');
                    }}
                  />
                  <StatCard
                    icon={DollarSign}
                    title="Выручка"
                    value={`${analytics.revenue} сум`}
                    subtitle={`${analytics.avgOrderValue} сум средний чек`}
                    color="emerald"
                    onClick={() => {
                      setActiveTab('data');
                      handleTabChange('unified');
                      handleSearchChange('order_price');
                    }}
                  />
                </div>

                {/* Data Sources Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-orange-50 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Источники данных</h3>
                    <p className="text-gray-600 text-sm mt-1">Распределение записей по источникам</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { name: 'Hardware Orders', count: sampleData.filter(d => d.hardware).length, table: 'hardware', icon: '⚙️', color: 'blue' },
                        { name: 'Sales Reports', count: sampleData.filter(d => d.sales).length, table: 'sales', icon: '📊', color: 'green' },
                        { name: 'Fiscal Receipts', count: sampleData.filter(d => d.fiscal).length, table: 'fiscal', icon: '🧾', color: 'purple' },
                        { name: 'Payme Payments', count: sampleData.filter(d => d.payme).length, table: 'payme', icon: '💳', color: 'indigo' },
                        { name: 'Click Payments', count: sampleData.filter(d => d.click).length, table: 'click', icon: '📱', color: 'pink' },
                        { name: 'Uzum Payments', count: sampleData.filter(d => d.uzum).length, table: 'uzum', icon: '🟣', color: 'violet' }
                      ].map((source) => (
                        <div 
                          key={source.table}
                          className={`bg-gradient-to-br from-${source.color}-50 to-${source.color}-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-${source.color}-200`}
                          onClick={() => {
                            setActiveTab('data');
                            handleTabChange(source.table);
                          }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{source.icon}</div>
                            <p className={`text-3xl font-bold text-${source.color}-700`}>{source.count}</p>
                            <p className={`text-sm text-${source.color}-600 font-medium mt-1`}>{source.name}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                              Клик для просмотра <ChevronRight className="h-3 w-3 ml-1" />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Issues Dashboard */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-red-50 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Мониторинг проблем</h3>
                    <p className="text-gray-600 text-sm mt-1">Выявленные расхождения и ошибки</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div 
                        className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-red-200"
                        onClick={() => {
                          setActiveTab('data');
                          handleTabChange('unified');
                          handleSearchChange('error');
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                          <span className="font-bold text-red-900">Расхождения цен</span>
                        </div>
                        <p className="text-3xl font-bold text-red-600 mb-1">{analytics.priceDiscrepancies}</p>
                        <p className="text-sm text-red-600 flex items-center">
                          требуют проверки <ChevronRight className="h-3 w-3 ml-1" />
                        </p>
                      </div>
                      
                      <div 
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-yellow-200"
                        onClick={() => {
                          setActiveTab('data');
                          handleTabChange('unified');
                          handleSearchChange('match_score: 1');
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Clock className="h-6 w-6 text-yellow-600" />
                          <span className="font-bold text-yellow-900">Неполные данные</span>
                        </div>
                        <p className="text-3xl font-bold text-yellow-600 mb-1">
                          {sampleData.filter(d => d.unified.match_score <= 2).length}
                        </p>
                        <p className="text-sm text-yellow-600 flex items-center">
                          заказов с низким скором <ChevronRight className="h-3 w-3 ml-1" />
                        </p>
                      </div>
                      
                      <div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-blue-200"
                        onClick={() => {
                          setActiveTab('data');
                          handleTabChange('unified');
                          handleSearchChange('Refunded');
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Zap className="h-6 w-6 text-blue-600" />
                          <span className="font-bold text-blue-900">Возвраты</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-1">
                          {sampleData.filter(d => d.unified.payment_status === 'Refunded').length}
                        </p>
                        <p className="text-sm text-blue-600 flex items-center">
                          возвращенных заказов <ChevronRight className="h-3 w-3 ml-1" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Machine Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-green-50 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Топ автоматы по выручке</h3>
                    <p className="text-gray-600 text-sm mt-1">Рейтинг производительности автоматов</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {(() => {
                        // Группируем данные по автоматам
                        const machineStats: Record<string, {code: string, address: string, revenue: number, orders: number}> = {};
                        sampleData.forEach(d => {
                          const machineCode = d.unified.machine_code;
                          const price = d.unified.order_price || 0;
                          const address = d.unified.address;
                          
                          if (machineCode) {
                            if (!machineStats[machineCode]) {
                              machineStats[machineCode] = {
                                code: machineCode,
                                address: address,
                                revenue: 0,
                                orders: 0
                              };
                            }
                            machineStats[machineCode].revenue += price;
                            machineStats[machineCode].orders += 1;
                          }
                        });
                        
                        // Сортируем по выручке и берем топ-5
                        const topMachines = Object.values(machineStats)
                          .sort((a, b) => b.revenue - a.revenue)
                          .slice(0, 5);
                        
                        return topMachines.map((machine, i) => (
                          <div 
                            key={machine.code} 
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-orange-50 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-orange-200"
                            onClick={() => {
                              setActiveTab('data');
                              handleTabChange('unified');
                              handleSearchChange(machine.code);
                            }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                i === 0 ? 'bg-yellow-100 text-yellow-800' :
                                i === 1 ? 'bg-gray-100 text-gray-800' :
                                i === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">
                                  🤖 Автомат {machine.code}
                                </p>
                                <p className="text-sm text-gray-600">
                                  📍 {machine.address}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-green-600">
                                {machine.revenue.toLocaleString()} сум
                              </p>
                              <p className="text-sm text-gray-500 flex items-center justify-end">
                                📦 {machine.orders} заказов <ChevronRight className="h-4 w-4 ml-1" />
                              </p>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Нет данных для анализа
                </h3>
                <p className="text-gray-500 mb-6">
                  Создайте базу данных и загрузите файлы для получения аналитики
                </p>
                <button
                  onClick={() => setActiveTab('database')}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200"
                >
                  Перейти к созданию БД
                </button>
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Логи системы</h2>
                <p className="text-gray-600 mt-1">История операций и событий системы</p>
              </div>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                Очистить логи
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Системные события</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {logs.map((log) => (
                      <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${
                            log.type === 'success' ? 'text-green-600' :
                            log.type === 'error' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {log.message}
                          </p>
                          <span className="text-xs text-gray-400">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg text-gray-500">Логи пусты</p>
                    <p className="text-sm text-gray-400 mt-1">События системы будут отображаться здесь</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Record Details */}
      {modalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-orange-50 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Детали записи</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div key={key} className="border-b pb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-gray-900">
                      {typeof value === 'object' && value instanceof Date 
                        ? value.toLocaleString() 
                        : typeof value === 'object' 
                        ? JSON.stringify(value, null, 2)
                        : String(value || 'N/A')
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendingDBManager;