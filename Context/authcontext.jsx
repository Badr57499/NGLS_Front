import {createContext , useContext , useState , useEffect} from 'react'
import api from './api'
const AuthContext = createContext();

export default function AuthProvider({children}){
    const [user , setUser] = useState(null)
    const [isloading , setIsloading] = useState(true)
    useEffect(()=>{
        const authCheck = async () => {
        const token =   localStorage.getItem("token")
        if(!token){
            setIsloading(false)
            return
        }
        try{
         const res = await api.get('/api/me', {
            headers : {Authorization:`Bearer ${token}`}
         });
        setUser(res.data.user)

    }catch(err){
        localStorage.removeItem("token");
        setUser(null)
    }finally{
        setIsloading(false)
    }
        }
        authCheck()
    },[])

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null)
    }
   return(
    <AuthContext.Provider value={{user , setUser ,isloading, logout}}>
        {children}
    </AuthContext.Provider>
   )
    

}
export const useAuth = () => useContext(AuthContext)