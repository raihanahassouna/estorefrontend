import React, { useEffect, useState } from 'react';

const ProductModal = ({ product, onClose, onSave }) => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    stock: ''
  });

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (product) {
      setValues({
        name: product.name || '',
        description: product.description || '',
          price: product.price || '',
          image: null,
          stock: product.stock ?? product.quantity ?? ''
      });

      setPreview(product.imageUrl || '');
    }
  }, [product]);

  const handleChange = (key) => (e) => {
    setValues((prev) => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setValues((prev) => ({
        ...prev,
        image: file
      }));

      setPreview(imageUrl);
    }
  };

  const handleSave = () => {
    onSave({
      ...values,
      price: Number(values.price) || 0,
      stock: Number(values.stock) || 0,
      imageUrl: preview
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200
      }}
    >
      <div
        style={{
          width: 560,
          maxWidth: '94%',
          background: 'white',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 30px 60px rgba(0,0,0,0.25)'
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {product ? 'Modifier le produit' : 'Ajouter un produit'}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
          }}
        >
          <input
            type="text"
            placeholder="Nom"
            value={values.name}
            onChange={handleChange('name')}
            style={{
              padding: 10,
              borderRadius: 8,
              border: '1px solid #E2E8F0'
            }}
          />

          <input
            type="number"
            placeholder="Prix"
            value={values.price}
            onChange={handleChange('price')}
            style={{
              padding: 10,
              borderRadius: 8,
              border: '1px solid #E2E8F0'
            }}
          />

          <input
            type="number"
            placeholder="Stock"
            value={values.stock}
            onChange={handleChange('stock')}
            style={{
              padding: 10,
              borderRadius: 8,
              border: '1px solid #E2E8F0'
            }}
          />

          {/* Upload image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              gridColumn: '1 / -1',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #E2E8F0'
            }}
          />

          {/* Preview image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                gridColumn: '1 / -1',
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid #E2E8F0'
              }}
            />
          )}

          <textarea
            placeholder="Description"
            value={values.description}
            onChange={handleChange('description')}
            style={{
              gridColumn: '1 / -1',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              minHeight: 100,
              resize: 'none'
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 16
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: '#EDF2F7',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: '#3182CE',
              color: 'white',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;