import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth }) {

    const [users, setUsers] = useState([]); 

  useEffect(() => {
    fetch('/users') 
      .then((response) => response.json()) 
      .then((data) => {
        setUsers(data); 
      })
      .catch((error) => {
        console.error('Erro ao consumir a API:', error); 
      });
  }, []);



    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="font-bold stext text-2xl text-center p-6 text-gray-900">Lista de Usuários em nosso Sistema</div>
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">
                                        CPF
                                    </th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 border border-slate-300 text-center text-sm font-medium text-gray-600">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className=" text-center px-6 py-4 border-b text-sm text-gray-900">{user.id}</td>
                    <td className=" text-center px-6 py-4 border-b text-sm text-gray-900">{user.cpf}</td>
                    <td className=" text-center px-6 py-4 border-b text-sm text-gray-900">{user.name}</td>
                    <td className=" text-center px-6 py-4 border-b text-sm text-gray-900">{user.email}</td>
                    <td className=" text-center px-6 py-4 border-b text-sm text-gray-900">
                    <button
                        onClick={() => handleEdit(user.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                      >
                        Remover
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
