/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Settings, 
  Plus, 
  MessageSquare, 
  Wrench, 
  BookOpen, 
  Globe, 
  Cpu, 
  Network, 
  Download, 
  Megaphone,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from './constants';
import { SupportRequest, Equipment, Message, User, Priority, RequestStatus } from './types';

// Mock Auth & Storage
const STORAGE_KEYS = {
  REQUESTS: 'tundima_requests',
  EQUIPMENT: 'tundima_equipment',
  MESSAGES: 'tundima_messages',
  USER: 'tundima_user'
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'login' | 'services' | 'request' | 'my-requests' | 'equipment' | 'chat' | 'admin' | 'training'>('home');
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load data
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (savedRequests) setRequests(JSON.parse(savedRequests));

    const savedEquip = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    if (savedEquip) setEquipment(JSON.parse(savedEquip));

    const savedMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const handleLogin = (email: string, role: 'client' | 'admin') => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, name: email.split('@')[0], role };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setView('home');
  };

  const addRequest = (data: Partial<SupportRequest>) => {
    if (!user) return;
    const newRequest: SupportRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      type: data.type || 'Geral',
      description: data.description || '',
      priority: data.priority || 'Média',
      status: 'Pendente',
      createdAt: new Date().toISOString(),
      ...data
    };
    setRequests([newRequest, ...requests]);
    setView('my-requests');
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const addEquipment = (data: Partial<Equipment>) => {
    const newEquip: Equipment = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || '',
      type: data.type || '',
      serialNumber: data.serialNumber || '',
      companyId: user?.id || 'guest',
      ...data
    };
    setEquipment([...equipment, newEquip]);
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const sendMessage = (text: string) => {
    if (!user || !activeRequestId) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      requestId: activeRequestId,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: new Date().toISOString(),
      isAdmin: user.role === 'admin'
    };
    setMessages([...messages, newMessage]);
  };

  // Components
  const Navbar = () => (
    <nav className="bg-zinc-900 text-white p-4 sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Tundima Smart</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 hidden md:block">Olá, {user.name}</span>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setView('admin')}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-emerald-400"
                  title="Painel Admin"
                >
                  <ShieldCheck size={20} />
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Entrar
            </button>
          )}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <section className="text-center space-y-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tighter sm:text-7xl"
        >
          Tundima Smart
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-lg max-w-2xl mx-auto"
        >
          Sua parceira tecnológica em Angola. Suporte técnico, gestão de equipamentos e formação especializada.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionButton 
          icon={<Wrench className="text-emerald-500" />}
          title="Pedir Suporte"
          description="Solicite assistência técnica imediata"
          onClick={() => user ? setView('request') : setView('login')}
        />
        <ActionButton 
          icon={<Globe className="text-blue-500" />}
          title="Nossos Serviços"
          description="Conheça as soluções Tundima Ngola"
          onClick={() => setView('services')}
        />
        <ActionButton 
          icon={<BookOpen className="text-amber-500" />}
          title="Formação"
          description="Cursos de informática e literacia digital"
          onClick={() => setView('training')}
        />
        <ActionButton 
          icon={<Settings className="text-zinc-500" />}
          title="Gestão de Equipamentos"
          description="Controle o inventário da sua empresa"
          onClick={() => user ? setView('equipment') : setView('login')}
        />
      </div>

      {user && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Meus Pedidos Recentes</h2>
            <button onClick={() => setView('my-requests')} className="text-emerald-500 text-sm font-medium flex items-center gap-1">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {requests.filter(r => r.userId === user.id).slice(0, 3).map((req: SupportRequest) => (
              <RequestCard key={req.id} request={req} onClick={() => {
                setActiveRequestId(req.id);
                setView('chat');
              }} />
            ))}
            {requests.filter(r => r.userId === user.id).length === 0 && (
              <div className="p-8 border-2 border-dashed border-zinc-200 rounded-2xl text-center text-zinc-400">
                Nenhum pedido realizado ainda.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );

  const ServicesView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('home')} className="p-2 hover:bg-zinc-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Serviços Tundima Ngola</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map(service => (
          <div key={service.id} className="p-6 bg-white border border-zinc-200 rounded-2xl hover:shadow-lg transition-shadow space-y-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-emerald-600">
              {getServiceIcon(service.icon)}
            </div>
            <h3 className="text-xl font-bold">{service.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{service.description}</p>
            <button 
              onClick={() => setView('request')}
              className="w-full py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              Solicitar Orçamento
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const RequestFormView = () => {
    const [formData, setFormData] = useState({
      type: 'Manutenção de Computadores',
      description: '',
      priority: 'Média' as Priority
    });

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 hover:bg-zinc-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Novo Pedido de Suporte</h1>
        </div>
        
        <form className="space-y-6 bg-white p-8 border border-zinc-200 rounded-2xl shadow-sm" onSubmit={(e) => {
          e.preventDefault();
          addRequest(formData);
        }}>
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Tipo de Problema</label>
            <select 
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Descrição do Problema</label>
            <textarea 
              required
              rows={4}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Descreva detalhadamente o que está a acontecer..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Prioridade</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Baixa', 'Média', 'Alta', 'Crítica'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.priority === p 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Anexos (Opcional)</label>
            <div className="flex gap-4">
              <button type="button" className="flex-1 py-3 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 transition-colors">
                <ImageIcon size={20} /> Foto
              </button>
              <button type="button" className="flex-1 py-3 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 transition-colors">
                <FileText size={20} /> PDF
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-500 text-zinc-900 font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Enviar Solicitação
          </button>
        </form>
      </div>
    );
  };

  const EquipmentView = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [newEquip, setNewEquip] = useState({ name: '', type: 'Laptop', serialNumber: '' });

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 hover:bg-zinc-100 rounded-full">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipamentos</h1>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800"
          >
            <Plus size={20} /> Adicionar
          </button>
        </div>

        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-xl space-y-4"
          >
            <h3 className="font-bold text-lg">Novo Equipamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input 
                placeholder="Nome (ex: MacBook Pro)"
                className="p-2 border rounded-lg"
                value={newEquip.name}
                onChange={e => setNewEquip({...newEquip, name: e.target.value})}
              />
              <select 
                className="p-2 border rounded-lg"
                value={newEquip.type}
                onChange={e => setNewEquip({...newEquip, type: e.target.value})}
              >
                <option>Laptop</option>
                <option>Desktop</option>
                <option>Servidor</option>
                <option>Impressora</option>
                <option>Router/Switch</option>
              </select>
              <input 
                placeholder="Nº de Série"
                className="p-2 border rounded-lg"
                value={newEquip.serialNumber}
                onChange={e => setNewEquip({...newEquip, serialNumber: e.target.value})}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-zinc-500">Cancelar</button>
              <button onClick={() => {
                addEquipment(newEquip);
                setShowAdd(false);
                setNewEquip({ name: '', type: 'Laptop', serialNumber: '' });
              }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Salvar</button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {equipment.map(item => (
            <div key={item.id} className="p-4 bg-white border border-zinc-200 rounded-xl flex justify-between items-center group">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-xs text-zinc-400 uppercase tracking-tighter">{item.type} • {item.serialNumber}</p>
                </div>
              </div>
              <button onClick={() => deleteEquipment(item.id)} className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {equipment.length === 0 && !showAdd && (
            <div className="col-span-full p-12 text-center text-zinc-400 border-2 border-dashed rounded-2xl">
              Nenhum equipamento registado.
            </div>
          )}
        </div>
      </div>
    );
  };

  const ChatView = () => {
    const [input, setInput] = useState('');
    const request = requests.find(r => r.id === activeRequestId);
    const chatMessages = messages.filter(m => m.requestId === activeRequestId);

    if (!request) return null;

    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-6">
        <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setView(user?.role === 'admin' ? 'admin' : 'my-requests')} className="p-2 hover:bg-zinc-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="font-bold leading-none">{request.type}</h3>
              <span className="text-xs text-zinc-400">ID: {request.id} • {request.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getPriorityColor(request.priority)}`}>
              {request.priority}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 border-x border-zinc-200 space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-sm text-emerald-800">
            <strong>Descrição do Problema:</strong> {request.description}
          </div>
          
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.senderId === user?.id 
                ? 'bg-zinc-900 text-white rounded-tr-none' 
                : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
              }`}>
                <div className="flex justify-between gap-4 mb-1">
                  <span className="font-bold text-[10px] uppercase opacity-70">{msg.senderName}</span>
                  <span className="text-[10px] opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                {msg.text}
              </div>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-sm italic">
              Aguardando resposta do técnico...
            </div>
          )}
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-b-2xl">
          <form className="flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage(input);
              setInput('');
            }
          }}>
            <input 
              className="flex-1 p-3 bg-zinc-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Escreva sua mensagem..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="p-3 bg-emerald-500 text-zinc-900 rounded-xl hover:bg-emerald-600 transition-colors">
              <MessageSquare size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  };

  const AdminPanelView = () => {
    const [filter, setFilter] = useState<RequestStatus | 'Todos'>('Todos');
    const filteredRequests = filter === 'Todos' ? requests : requests.filter(r => r.status === filter);

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
            <p className="text-zinc-500">Gerencie todos os pedidos de suporte da Tundima Smart.</p>
          </div>
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl">
            {(['Todos', 'Pendente', 'Em Processo', 'Concluído'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Cliente</th>
                <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Serviço</th>
                <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Prioridade</th>
                <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Estado</th>
                <th className="p-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-sm">{req.userName}</div>
                    <div className="text-[10px] text-zinc-400">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-zinc-600">{req.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(req.priority)}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      className={`text-[10px] font-bold uppercase p-1 rounded border-none outline-none cursor-pointer ${getStatusColor(req.status)}`}
                      value={req.status}
                      onChange={(e) => updateRequestStatus(req.id, e.target.value as RequestStatus)}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Processo">Em Processo</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setActiveRequestId(req.id);
                          setView('chat');
                        }}
                        className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => deleteRequest(req.id)}
                        className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-400 italic">Nenhum pedido encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-zinc-200 rounded-3xl shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold text-zinc-900">T</div>
          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo à Tundima</h2>
          <p className="text-zinc-500 text-sm">Entre com sua conta para solicitar suporte</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleLogin(email, isAdmin ? 'admin' : 'client');
        }}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email</label>
            <input 
              required
              type="email"
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="exemplo@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Senha</label>
            <input 
              required
              type="password"
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="admin" 
              className="w-4 h-4 accent-emerald-500"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="admin" className="text-sm text-zinc-600 cursor-pointer">Entrar como Administrador</label>
          </div>

          <button className="w-full py-4 bg-emerald-500 text-zinc-900 font-bold rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
            Aceder ao Painel
          </button>
        </form>

        <div className="text-center">
          <button onClick={() => setView('home')} className="text-sm text-zinc-400 hover:text-zinc-600">Voltar para o Início</button>
        </div>
      </div>
    );
  };

  const TrainingView = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('home')} className="p-2 hover:bg-zinc-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Formação Tundima Smart</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-900 text-white rounded-3xl space-y-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-900">
            <BookOpen size={32} />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter">Cursos Disponíveis</h2>
          <p className="text-zinc-400 leading-relaxed">
            Oferecemos formação especializada para empresas e particulares. Do básico ao avançado, capacitamos sua equipa para os desafios digitais.
          </p>
          <ul className="space-y-3">
            {['Microsoft Office (Excel, Word, PPT)', 'Literacia Digital para Empresas', 'Introdução à Programação', 'Cibersegurança Básica'].map(item => (
              <li key={item} className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 size={18} className="text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white text-zinc-900 font-bold rounded-2xl hover:bg-zinc-100 transition-colors">
            Inscrever-se Agora
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl flex gap-4 items-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold">Horários Flexíveis</h4>
              <p className="text-sm text-zinc-500">Manhã, tarde e pós-laboral.</p>
            </div>
          </div>
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl flex gap-4 items-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <UserIcon size={24} />
            </div>
            <div>
              <h4 className="font-bold">Certificação Tundima</h4>
              <p className="text-sm text-zinc-500">Certificado reconhecido pelo INEFOP.</p>
            </div>
          </div>
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl flex gap-4 items-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="font-bold">Presencial ou Online</h4>
              <p className="text-sm text-zinc-500">Escolha a modalidade que preferir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MyRequestsView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 hover:bg-zinc-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        </div>
        <button 
          onClick={() => setView('request')}
          className="bg-emerald-500 text-zinc-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
        >
          <Plus size={20} /> Novo Pedido
        </button>
      </div>

      <div className="space-y-4">
        {requests.filter(r => r.userId === user?.id).map((req: SupportRequest) => (
          <RequestCard 
            key={req.id} 
            request={req} 
            onClick={() => {
              setActiveRequestId(req.id);
              setView('chat');
            }} 
          />
        ))}
        {requests.filter(r => r.userId === user?.id).length === 0 && (
          <div className="p-20 text-center text-zinc-400 space-y-4 border-2 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-zinc-50 rounded-full mx-auto flex items-center justify-center">
              <Clock size={32} />
            </div>
            <p>Ainda não tens nenhum pedido de suporte ativo.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Navbar />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'home' && <HomeView />}
            {view === 'login' && <LoginView />}
            {view === 'services' && <ServicesView />}
            {view === 'request' && <RequestFormView />}
            {view === 'my-requests' && <MyRequestsView />}
            {view === 'equipment' && <EquipmentView />}
            {view === 'chat' && <ChatView />}
            {view === 'admin' && <AdminPanelView />}
            {view === 'training' && <TrainingView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-2 flex justify-around items-center z-50">
          <button onClick={() => setView('home')} className={`p-2 flex flex-col items-center gap-1 ${view === 'home' ? 'text-emerald-500' : 'text-zinc-400'}`}>
            <Layout size={20} />
            <span className="text-[10px] font-bold uppercase">Início</span>
          </button>
          <button onClick={() => setView('my-requests')} className={`p-2 flex flex-col items-center gap-1 ${view === 'my-requests' ? 'text-emerald-500' : 'text-zinc-400'}`}>
            <Clock size={20} />
            <span className="text-[10px] font-bold uppercase">Pedidos</span>
          </button>
          <button onClick={() => setView('request')} className="p-3 bg-emerald-500 text-zinc-900 rounded-full -mt-8 shadow-lg shadow-emerald-500/40">
            <Plus size={24} />
          </button>
          <button onClick={() => setView('equipment')} className={`p-2 flex flex-col items-center gap-1 ${view === 'equipment' ? 'text-emerald-500' : 'text-zinc-400'}`}>
            <Settings size={20} />
            <span className="text-[10px] font-bold uppercase">Gestão</span>
          </button>
          <button onClick={() => setView('chat')} className={`p-2 flex flex-col items-center gap-1 ${view === 'chat' ? 'text-emerald-500' : 'text-zinc-400'}`}>
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold uppercase">Chat</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-components
function ActionButton({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-6 bg-white border border-zinc-200 rounded-3xl text-left hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
    >
      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-zinc-400 text-sm leading-tight">{description}</p>
    </button>
  );
}

interface RequestCardProps {
  request: SupportRequest;
  onClick: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusBg(request.status)}`}>
          {getStatusIcon(request.status)}
        </div>
        <div>
          <h4 className="font-bold text-sm group-hover:text-emerald-600 transition-colors">{request.type}</h4>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
            <span>#{request.id}</span>
            <span>•</span>
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(request.priority)}`}>
          {request.priority}
        </span>
        <ChevronRight size={18} className="text-zinc-300 group-hover:text-emerald-500 transition-colors" />
      </div>
    </div>
  );
}

// Helpers
function getServiceIcon(iconName: string) {
  switch (iconName) {
    case 'Network': return <Network size={24} />;
    case 'Globe': return <Globe size={24} />;
    case 'Cpu': return <Cpu size={24} />;
    case 'Download': return <Download size={24} />;
    case 'BookOpen': return <BookOpen size={24} />;
    case 'Megaphone': return <Megaphone size={24} />;
    default: return <Wrench size={24} />;
  }
}

function getStatusIcon(status: RequestStatus) {
  switch (status) {
    case 'Pendente': return <Clock size={18} className="text-amber-500" />;
    case 'Em Processo': return <AlertCircle size={18} className="text-blue-500" />;
    case 'Concluído': return <CheckCircle2 size={18} className="text-emerald-500" />;
    case 'Cancelado': return <X size={18} className="text-red-500" />;
  }
}

function getStatusBg(status: RequestStatus) {
  switch (status) {
    case 'Pendente': return 'bg-amber-50';
    case 'Em Processo': return 'bg-blue-50';
    case 'Concluído': return 'bg-emerald-50';
    case 'Cancelado': return 'bg-red-50';
  }
}

function getStatusColor(status: RequestStatus) {
  switch (status) {
    case 'Pendente': return 'bg-amber-100 text-amber-700';
    case 'Em Processo': return 'bg-blue-100 text-blue-700';
    case 'Concluído': return 'bg-emerald-100 text-emerald-700';
    case 'Cancelado': return 'bg-red-100 text-red-700';
  }
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case 'Baixa': return 'bg-zinc-100 text-zinc-500';
    case 'Média': return 'bg-blue-100 text-blue-600';
    case 'Alta': return 'bg-orange-100 text-orange-600';
    case 'Crítica': return 'bg-red-100 text-red-600';
  }
}
