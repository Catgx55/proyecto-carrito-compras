import { useState, useEffect } from "react"
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

function App() {

    //funcion persistencia LocalStorage
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    //State
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEM = 5
    const MIN_ITEM = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if(itemExists >= 0){//existe en el carrito
            if(cart[itemExists].quantity >= MAX_ITEM) return
            const updateCart = [...cart]//actualizacion de cantidad sin mutar el state
            updateCart[itemExists].quantity++
            setCart(updateCart)
        }else{
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    //funcion eliminar item
    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    //funcion incrementar item
    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity < MAX_ITEM){
                return{
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    //funcion decrementar item
    function decreaseQuantity(id){
        const dowCart = cart.map(item => {
            if(item.id === id && item.quantity > MIN_ITEM){
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(dowCart)
    }

    //funcion vaciar item
    function clearCart(e) {
        setCart([])
    }

return (
    <>
    <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar) => (
                <Guitar
                    key={guitar.id}
                    guitar={guitar}
                    setCart={setCart}
                    addToCart={addToCart}
                />
            ))}
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
    )
}

export default App
