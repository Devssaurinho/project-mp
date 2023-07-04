import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/atlax.png';

const serverUrl = 'http://localhost:8000/';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [contaSucesso, setContaSucesso] = useState('');

  const validateInputs = () => {
    let hasError = false;

    if (!username) {
      setUsernameError('O campo usuário é obrigatório.');
      hasError = true;
    } else if (!/^[a-zA-Z]+$/.test(username)) {
      setUsernameError('O campo usuário só pode conter letras.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!senha) {
      setSenhaError('O campo senha é obrigatório.');
      hasError = true;
    } else if (!/^\d+$/.test(senha)) {
      setSenhaError('A senha deve conter apenas números.');
      hasError = true;
    } else {
      setSenhaError('');
    }

    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const passwordInt = parseInt(senha, 10);

      const response = await axios.post(`${serverUrl}Usuarios/criar-usuario`, {
        username,
        senha: passwordInt,
        id: 0,
        admin: 0,
        preferencias: [0],
        amigos: [0],
        bloqueados: [0],
        grupos: [0],
      });

      if (response.status === 201) {
        // A conta foi criada com sucesso
        setContaSucesso('Conta criada com sucesso!');
        // Redirecionar para outra página, se necessário
      } else {
        // Algo deu errado ao criar a conta
        setSenhaError('Não foi possível criar a conta. Por favor, tente novamente.');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          // Erro de requisição inválida (400)
          setUsernameError('Esse nome de usuário já existe. Por favor escolha outro.');
        } else if (err.response.status === 404) {
          // Página não encontrada (404)
          setSenhaError('Endpoint não encontrado. Por favor, verifique a URL do servidor.');
        } else if (err.response.status === 422) {
          // Erro de validação (422)
          const { detail } = err.response.data;
          let errorMessage = 'Erro de validação. Por favor, verifique os dados fornecidos.';

          if (detail && Array.isArray(detail) && detail.length > 0) {
            errorMessage = detail.map((error) => error.msg).join('\n');
          }

          setSenhaError(errorMessage);
        }
      } else {
        // Outro erro de requisição
        setSenhaError('Ocorreu um erro ao criar a conta. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-50 w-auto"
            src={logo}
            alt="Atlax Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#53a9f6]">
            Crie sua conta!
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                Usuário
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                  Senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {senhaError && <p className="text-red-500 text-xs mt-1">{senhaError}</p>}
              {contaSucesso && <p className="text-green-500 text-xs mt-1">{contaSucesso}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#53a9f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
