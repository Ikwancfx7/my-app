import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [name,setName] = useState('');
// const [job, setJob] = useState('');
const [email, setEmail] = useState('');
const [editingUser, setEditingUser] = useState(null);
const API_URL = 'https://6580f9853dfdd1b11c424344.mockapi.io/rakamin/employee';

  const getData = () => {
    axios.get(API_URL)
      .then((res) => {
        console.log("response API ==", res.data);
        setData(res.data); // simpan hasil API ke state
        setLoading(false);
      })
      .catch((err) => {
        console.log("error fetching users", err);
        setLoading(false);
      })
  };

  const postData = (e) => {
    e.preventDefault();
    axios.post(API_URL, {
      name: name,
      email: email
    })
    .then(() => {
      getData();
      setName('');
      setEmail('');
    })
    .catch((err) => {
      console.log("Error:", err);
      alert('something went wrong')
    })
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const putData = async (id) => {
    try{
      const response = await axios.put(`${API_URL}/${id}`,{
        name: name,
        email: email,
      });
      setData(prevData => prevData.map(user=>
        user.id === id ? {...user, name, email} : user
      ));
      setName('');
      setEmail('');
      setEditingUser(null);

      console.log('Update Response:', response.data);
    } catch(error) {
      console.error('Error updating post:', error);
    }
  };
  
  // const putData = (id) => {
  //   axios.put(`${API_URL}/${id}`,{
  //     name: name,
  //     email: email,
  //   })
  //   .then(()=>{
  //     getData();
  //     setName('');
  //     setEmail('');
  //     setEditingUser(null); //selesai edit
  //   })
  //   .catch((error)=>{
  //     alert('Error updating data', error);
  //   })
  // }

  const deleteData = (id) => {
    axios.delete(`${API_URL}/${id}`)
    .then(()=>{
      getData();
    })
    .catch((err)=>{
      console.log('Erorr deleting data', err);
    })
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <h1>Data User</h1>
    {loading ? (
      <p>Loading... </p>
    ):(
      <div>
        
        {editingUser ? (
          <form onSubmit={(e)=>{
            e.preventDefault();
            putData(editingUser.id)
          }}>
            <input type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='eidt name' 
          />
          <input type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='edit email' 
          />
          <button type='submit'>Save Changes</button>
          <button type='button' onClick={()=>setEditingUser(null)}>Cancel</button>
          </form>
        ):(
          <div>
            <form onSubmit={postData} style={{ marginBottom: '20px' }} autoComplete='off'>
              <input type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Input your name' 
              />
              <input type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Input your email' 
              />
              <button type='submit'>Create User</button>
            </form>
            <ol>
              {data.map((user) => (
                <div key={user.id}>
                  <li>{user.name}; {user.email}</li>
                  <button onClick={()=>deleteData(user.id)}>Delete</button>
                  <button onClick={()=>startEditing(user)}>Update</button>
                </div>
              ))}
            </ol>
          </div>

        )}
      </div>
    )}
    </>
  )
}

export default App
