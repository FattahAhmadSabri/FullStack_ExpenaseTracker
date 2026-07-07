const api =""
const handleLogin = async(event)=>{
     event.preventDefault(event)
     const name = document.getElementById("name").value 
     const email = document.getElementById("email").value 
     const password = document.getElementById("password").value

     try {
        const response = await axios.post(api,{
            name,email,password
        })
        console.log(response.data)
     } catch (error) {
       console.log(error) 
     }
}