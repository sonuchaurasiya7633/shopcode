import Layout from "./Layout";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import firebaseAppconfig from "../../util/firebase-config";
import { getFirestore, addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseAppconfig);

const Products = () => {
  const [products, setProducts] = useState([]);
  const model = {
    title: "",
    description: "",
    price: "",
    discount: "",
  };
  const [productForm, setProductForm] = useState(model);
  const [productModal, setProductModal] = useState(false);
  const [applyCloseAnimation, SetApplyCloseAnimation] = useState(false);
  const[edit,setEdit] = useState(null)
  useEffect(() => {
    const req = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = [];
        snapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    req();
  }, []);

  const handleModalClose = () => {
    SetApplyCloseAnimation(true);
    setTimeout(() => {
      setProductModal(false);
    }, 700);
  };

  const handleModalOpen = () => {
    SetApplyCloseAnimation(false);
    setProductModal(true);
  };

  const handleProductForm = (e) => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    setProductForm({
      ...productForm,
      [name]: value,
    });
  };

  const createProduct = async (e) => {
    try {
      e.preventDefault();
      
      const productRef = await addDoc(collection(db, "products"), {
        ...productForm,
        image: "",
      });

    
      const newProduct = { id: productRef.id, ...productForm, image: "" };
      setProducts([...products, newProduct]);
      setProductForm(model);
      handleModalClose();

      Swal.fire({
        icon: "success",
        title: "Product created successfully, go check product",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to create product",
        text: err.message,
      });
    }
  };

  const upLoadProductImage = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "shopcode"); 
    data.append("cloud_name", "dqpbo1uho"); 

    try {
     
      const res = await fetch("https://api.cloudinary.com/v1_1/dqpbo1uho/image/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();

      
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { image: uploadedImage.url });

     
      const updatedProducts = products.map((product) =>
        product.id === productId ? { ...product, image: uploadedImage.url } : product
      );
      setProducts(updatedProducts);

      Swal.fire({
        icon: "success",
        title: "Product image updated successfully!",
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to upload image",
        text: err.message,
      });
    }
  };

    const deleteProduct = async(id) =>{
     try
     {
    const ref =  doc(db,"products",id)
    await deleteDoc(ref)
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    new Swal({
      icon:"success",
      title:'Product SuccessFully deleted'
    })
     }
     catch(err)
     {
      new Swal({
        icon:'error',
        title:'Failed to delete this product',
         text: err.message
      })
     }
    }

     const editProduct = (item) =>{
      setEdit(item)
      setProductForm(item)
      setProductModal(true)
     }
     const saveData = async (e) => {
      try {
        e.preventDefault();
        const ref = doc(db, "products", edit.id);
        await updateDoc(ref, productForm);
        setProductForm(model)
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === edit.id ? { ...product, ...productForm } : product
          )
        );
        setProductModal(false);
        setEdit(null);
    
        Swal.fire({
          icon: "success",
          title: "Product updated successfully!",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to update this product",
          text: err.message,
        });
      }
    };
  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <button
            className="bg-indigo-600 text-white rounded py-2 px-4 font-semibold"
            onClick={handleModalOpen}
          >
            <i className="ri-sticky-note-add-line mr-2"></i>
            New Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((item, index) => (
            <div key={index} className="bg-white rounded-md shadow-xl">
              <div className="relative">
                <img
                  src={item.image || "/images/pt.jpg"} 
                  className="rounded-t-md h-52 sm:h-64 w-full object-cover"
                  alt={item.title}
                />
                <input
                  onChange={(e) => upLoadProductImage(e, item.id)} 
                  type="file"
                  className="opacity-0 w-full h-full absolute top-0 left-0"
                />
              </div>
              <div className="p-4">

                <div className="flex items-center justify-between">

                <h1 className="font-semibold text-lg capitalize">{item.title}</h1>
                <div className="space-x-2">
                <button onClick={()=>editProduct(item)}>
                 <i className="ri-edit-box-line text-violet-600"></i>
                  </button>
                  <button onClick={()=>deleteProduct(item.id)}>
                  <i className="ri-delete-bin-6-line text-rose-600"></i>
                  </button>
                </div>
                  
                </div>
               
                <div className="flex gap-2 mt-1 flex-wrap">
                  <label>₹{item.price - (item.price * item.discount) / 100}</label>
                  <del className="font-semibold">₹{item.price}</del>
                  <label className="text-gray-600">({item.discount}% Off)</label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {productModal && (
          <div
            className={`${
              applyCloseAnimation ? "animate-fadeOut" : "animate-fadeIn"
            } bg-black absolute bg-opacity-80 top-0 left-0 w-full h-full flex justify-center items-center px-4`}
          >
            <div
              className={`${
                applyCloseAnimation ? "animate-zoomOut" : "animate-zoomIn"
              } bg-white w-full sm:w-10/12 md:w-8/12 lg:w-6/12 py-5 px-4 sm:px-6 rounded-md border-2 relative max-h-[90vh] overflow-y-auto`}
            >
              <button
                className="absolute top-2 right-3"
                onClick={handleModalClose}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
              <h1 className="text-lg font-semibold mb-4">New Product</h1>
              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                onSubmit={edit? saveData :createProduct}
              >
                <input
                  onChange={handleProductForm}
                  required
                  name="title"
                  placeholder="Enter Product Title Here"
                  className="p-2 border border-gray-300 rounded col-span-1 sm:col-span-2"
                  value={productForm.title}
                />

                <input
                  onChange={handleProductForm}
                  required
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="p-2 border border-gray-300 rounded"
                  value={productForm.price}
                />

                <input
                  onChange={handleProductForm}
                  required
                  type="number"
                  name="discount"
                  placeholder="Discount"
                  className="p-2 border border-gray-300 rounded"
                  value={productForm.discount}
                />

                <textarea
                  onChange={handleProductForm}
                  required
                  name="description"
                  placeholder="Description"
                  className="p-2 border border-gray-300 rounded col-span-1 sm:col-span-2"
                  rows={6}
                  value={productForm.description}
                />

                <div className="col-span-1 sm:col-span-2 text-right">
                  <button className="bg-indigo-600 text-white rounded px-4 py-2">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;