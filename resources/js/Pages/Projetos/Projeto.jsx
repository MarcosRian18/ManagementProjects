import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Projetos({ auth }) {
    const [formVisible, setFormVisible] = useState(false);
    const [projetosList, setProjetosList] = useState([]);
    const [isEditing, setIsEditing] = useState(false); 

    const { data, setData, post, put, delete: destroy, processing } = useForm({
        id: '', 
        nome: '',
        descricao: '',
        dt_entrega: '',
        qtd_task: ''
    });

    const fetchProjetosList = () => {
        fetch('/api/projetos/list')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setProjetosList(data);
            })
            .catch((error) => {
                console.error('Erro ao consumir a API:', error);
            });
    };

    useEffect(() => {
        fetchProjetosList();
    }, []);

    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            
            put(route('projetos.update', data.id), {
                onSuccess: () => {
                    setFormVisible(false);
                    setData({ id: '', nome: '', descricao: '', dt_entrega: '', qtd_task: '' });
                    setIsEditing(false); 
                    fetchProjetosList(); 
                }
            });
        } else {
           
            post(route('projetos.store'), {
                onSuccess: () => {
                    setFormVisible(false);
                    setData({ nome: '', descricao: '', dt_entrega: '', qtd_task: '' });
                    fetchProjetosList(); 
                }
            });
        }
    };

    const handleEdit = (projeto) => {
        setData({
            id: projeto.id, 
            nome: projeto.nome,
            descricao: projeto.descricao,
            dt_entrega: projeto.dt_entrega,
            qtd_task: projeto.qtd_task
        });
        setFormVisible(true);
        setIsEditing(true);  
    };

    
    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            destroy(route('projetos.destroy', id), {
                onSuccess: () => {
                    setProjetosList(projetosList.filter(projeto => projeto.id !== id));
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projetos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-center text-xl font-bold mb-4">Projetos</h2>

                        <button
                            onClick={() => setFormVisible(!formVisible)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            {formVisible ? 'Cancelar' : 'Novo Projeto'}
                        </button>

                        {formVisible && (
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Nome</label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Descrição</label>
                                    <textarea
                                        value={data.descricao}
                                        onChange={(e) => setData('descricao', e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Data de Entrega</label>
                                    <input
                                        type="date"
                                        value={data.dt_entrega}
                                        onChange={(e) => setData('dt_entrega', e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Quantidade de Tasks</label>
                                    <input
                                        type="text"
                                        value={data.qtd_task}
                                        onChange={(e) => setData('qtd_task', e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    disabled={processing}
                                >
                                    {processing ? 'Salvando...' : isEditing ? 'Atualizar Projeto' : 'Salvar Projeto'}
                                </button>
                            </form>
                        )}

                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b py-2">Nome</th>
                                    <th className="border-b py-2">Descrição</th>
                                    <th className="border-b py-2">Data de Entrega</th>
                                    <th className="border-b py-2">Quantidade de Tasks</th>
                                    <th className="border-b py-2">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projetosList.map((projeto) => (
                                    <tr key={projeto.id}>
                                        <td className="text-center border-b py-2">{projeto.nome}</td>
                                        <td className="text-center border-b py-2">{projeto.descricao}</td>
                                        <td className="text-center border-b py-2">{projeto.dt_entrega}</td>
                                        <td className="text-center border-b py-2">{projeto.qtd_task}</td>
                                        <td className="border-b py-2">
                                            <button
                                                onClick={() => handleEdit(projeto)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(projeto.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
