import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const EditForm = ({ bookId, onClose, onSave }) => {
  const [formulario, setFormulario] = useState({
    title: '',
    year: '',
    edition: '',
    editorial: '',
    'author(s)': '',
    category: '',
    amount: '',
    language: '',
    state: '',
  });

  const [categoriasLibros, setCategoriasLibros] = useState([]);

  useEffect(() => {
    console.log('Obteniendo categorías...');
    axios.get("http://localhost:4000/api/admin/getCategory")
      .then(response => {
        console.log('Categorías obtenidas:', response.data);
        setCategoriasLibros(response.data);
      })
      .catch(error => console.error('Error al obtener las categorías:', error));
  }, []);

  useEffect(() => {
    console.log('Valor de bookId:', bookId);
    axios.get(`http://localhost:4000/api/admin/get/books/${bookId}`)
      .then(response => {
        console.log('Datos del libro obtenidos:', response.data);
        setFormulario(response.data);
      })
      .catch(error => console.error('Error al obtener los datos del libro:', error));
  }, [bookId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmitLibros = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/admin/update/books/${bookId}`, formulario)
      .then(response => {
        onSave(response.data);
        toast.success("¡Libro actualizado con éxito!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        }); onClose();
      })
      .catch(error => console.error('Error al actualizar el libro:', error));
    console.log(formulario);
  };

  const handleCancelar = () => {
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmitLibros} className="max-w-lg mx-auto bg-white p-5 border rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formulario.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="year" className="block text-gray-700 font-bold mb-2">
              Año
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formulario.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>


        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="edition" className="block text-gray-700 font-bold mb-2">
              Edicion
            </label>
            <input
              type="number"
              id="edition"
              name="edition"
              value={formulario.edition}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="editorial" className="block text-gray-700 font-bold mb-2">
              Editorial
            </label>
            <input
              type="text"
              id="editorial"
              name="editorial"
              value={formulario.editorial}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <label htmlFor="author" className="block text-gray-700 font-bold mb-2">
              Autor(s)
            </label>
            <input
              type="text"
              id="author(s)"
              name="author(s)"
              value={formulario['author(s)']}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <div className="mb-2">
            <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
              Categoría
            </label>
            <div className="flex items-center">
              <select
                id="category"
                name="category"
                value={formulario.category}
                onChange={handleChange}
                className="p-2 border rounded w-2/3"
              >
                <option value="">Selecciona una categoria</option>
                {categoriasLibros.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="categoriaPersonalizada"
                name="category"
                value={formulario.category}
                onChange={handleChange}
                placeholder="Otra categoría"
                className="ml-2 p-2 border rounded w-1/3"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
              Cantidad
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formulario.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="language" className="block text-gray-700 font-bold mb-2">
              Lenguaje
            </label>
            <select
              id="language"
              name="language"
              value={formulario.language}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona un lenguaje</option>
              <option value="ES">ES</option>
              <option value="EN">EN</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="state" className="block text-gray-700 font-bold mb-2">
              Estado
            </label>
            <select
              id="state"
              name="state"
              value={formulario.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un Estado</option>
              <option value="DISPONIBLE">DISPONIBLE</option>
              <option value="EN USO">EN USO</option>
            </select>
          </div>
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start">
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Actualizar
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancelar}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
