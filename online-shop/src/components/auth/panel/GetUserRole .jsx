import axios from 'axios'

export const GetUserRole = async() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return null; // اگر توکن وجود ندارد، نقش خالی برگردانید
      console.log('token not exist');
    }
    
    
    try {
      const response = await axios.get('http://127.0.0.1:5000/user/role',{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      
      if(!response){
        console.log('response is null');
      }
      console.log(response.data.role);
      return response.data.role;
     
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };
  