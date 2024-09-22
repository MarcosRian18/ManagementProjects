import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios'; 

export default function Dashboard({ auth }) {
    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
      axios.get('/users')
          .then((response) => {
              console.log('Dados recebidos:', response.data);
              setUsers(response.data);
          })
          .catch((error) => {
              console.error('Erro ao consumir a API:', error);
          });
  }, []);

    
    const handleEdit = (userId) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
          console.log('Usuário selecionado para edição:', user);
          setSelectedUser({ ...user });
          setIsModalOpen(true);
      }
  };

    const handleDelete = (id) => {
      if (confirm("Tem certeza que deseja excluir este usuário?")) {
          axios
              .delete(route("users.destroy", id))
              .then(() => {
                  setUsers(users.filter((user) => user.id !== id));
              })
              .catch(() => {
                  console.error("Erro ao excluir usuário.");
              });
      }
  };

    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); 
    };

    
    const handleSave = () => {
      axios.put(`/users/${selectedUser.id}`, selectedUser)
          .then(() => {
              axios.get('/users').then((response) => {
                  setUsers(response.data); 
              });
              handleCloseModal(); 
          })
          .catch((error) => {
              console.error('Erro ao atualizar o usuário:', error);
          });
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (selectedUser && name) {
          const updatedUser = { ...selectedUser, [name]: value };
          console.log('Usuário atualizado:', updatedUser);
          setSelectedUser(updatedUser);
      }
  };
  

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="font-bold text-2xl text-center p-6 text-gray-900">
                            Lista de Usuários em nosso Sistema
                        </div>
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">ID</th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">CPF</th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">Nome</th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">Email</th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100">
                                        <td className="text-center px-6 py-4 border-b text-sm text-gray-900">{user.id}</td>
                                        <td className="text-center px-6 py-4 border-b text-sm text-gray-900">{user.cpf}</td>
                                        <td className="text-center px-6 py-4 border-b text-sm text-gray-900">{user.name}</td>
                                        <td className="text-center px-6 py-4 border-b text-sm text-gray-900">{user.email}</td>
                                        <td className="text-center px-6 py-4 border-b text-sm text-gray-900">
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600"
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

            
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4">Editar Usuário</h2>
                            <label className="block mb-2">
                                Nome:
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                CPF:
                                <input
                                    type="text"
                                    name="cpf"
                                    value={selectedUser.cpf}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                />
                            </label>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
