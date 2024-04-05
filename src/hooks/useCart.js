import { useState, useEffect, useMemo } from "react"
import { db } from '../data/db'

export const useCart = () => {

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

    //state Derivado
    const isEmpty = useMemo (() => cart.length === 0)
    const cartTotal = useMemo (() => cart.reduce((total, item) => total + (item.quantity * item.price), 0))//funcion para calcular total

        return{
            data,
            cart,
            addToCart,
            removeFromCart,
            decreaseQuantity,
            increaseQuantity,
            clearCart,
            isEmpty,
            cartTotal
        }
}
