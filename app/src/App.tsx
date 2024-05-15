import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import "./App.css";
import { Dice } from "./components/Dice";
import { Navbar } from "./components/Navbar";
import axios from "axios";
import { Alert } from "./components/Alert";

type User = {
  username: string;
  mail: string;
  password: string;
  throwsLeft: number;
  pastries: Pastry[];
};

type Pastry = {
  name: string;
  image: string;
  stock: number;
  quantityWon: number;
};

function App() {
  const [dices, setDices] = useState([0, 0, 0, 0, 0]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [pastriesCount, setPastriesCount] = useState<number>();
  const [results, setResults] = useState<User[]>();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Authentication - Get User
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8000/user", { params: { token: token } })
        .then((res) => {
          console.log("res get user", res);
          setUser(res.data);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          setErrorMessage(err.response.data);
        });
    }

    getPastriesCount();
  }, []);

  const getPastriesCount = useCallback(async () => {
    await axios.get("http://localhost:8000/pastries").then(async (res) => {
      const pastries = res.data.pastries;
      let count = 0;
      pastries.forEach((pastry: Pastry) => count = count + pastry.stock)
      console.log('setting count', count)
      setPastriesCount(count);
    });
  }, [])

  useEffect(() => { // End of the Game - Displaying the results when no more pastries
    if (pastriesCount === 0) {
      getResults();
    }
  }, [pastriesCount]);

  const getResults = useCallback(async () => {
    console.log("gettingResults");
    await axios.get("http://localhost:8000/results").then((res) => {
      setResults(res.data.winningUsers);
    });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(undefined), 2000);
    }
  }, [errorMessage]);

  useEffect(() => {
    console.log('rerender')
  }, [])

  const launch = useCallback(async () => {
    await axios
      .post(
        "http://localhost:8000/play",
        { user },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(async (res) => {
        setDices(res.data.digits);
        console.log('PASTRIES WON', res.data.pastries)
        const newPastries = res.data.pastries.map(pastry => pastry)
        user && setUser({ ...user, throwsLeft: user?.throwsLeft - 1, pastries: [...user.pastries, ...newPastries] });
      })
      .catch((err) => {
        setErrorMessage(err.response.data);
      })
      .finally(async () => {
        await getPastriesCount();
      });
  }, [getPastriesCount, user]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (user) {
  //       axios
  //         .get("http://localhost:8000/user", {
  //           params: { token: localStorage.getItem("token") },
  //         })
  //         .then((res) => {
  //             console.log("update user pastries", res.data);
  //             setUser({ ...res.data });
  //           // delay pastries local update
  //         })
  //         .catch((err) => {
  //           localStorage.removeItem("token");
  //           setErrorMessage(err.response.data);
  //         });
  //     }
  //   }, 2000)
  // }, [dices]);

  return (
    <main>
      <Navbar
        username={user && user.username}
        setUser={setUser}
        setErrorMessage={setErrorMessage}
      />
      <div className="py-3 pb-0">
        <h1 className="text-white">Yam's</h1>

        {dices.map((dice) => (
          <Dice key={gsap.utils.random(1, 10)} value={dice} />
        ))}

        { user && <p className="text-center text-white">Pâtisseries restantes : { pastriesCount }</p> }

        <div className="actions">
          {user && user.username ? (
            pastriesCount ? (
              user.throwsLeft > 0 && pastriesCount > 0 ? (
                <button onClick={() => launch() }>Lancer les dés ({user.throwsLeft})</button>
              ) : (
                <button className="bg-secondary btn-disabled">Vous ne pouvez plus jouer</button>
              )
            ) : (
              <button className="bg-secondary btn-disabled">
              Le jeu est terminé
            </button>
            )
          ) : (
            <strong className="text-white">
              Il faut être connecté pour pouvoir jouer
            </strong>
          )}
        </div>
      </div>
      {results ? (
        <div className="mt-5 text-white d-flex justify-content-center flex-column">
          <h3>🎊 Résultats 🎊</h3>
          <div className="d-flex justify-content-center">
            <div className="col-8">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Rang</th>
                    <th scope="col">Pseudo</th>
                    <th scope="col">Pâtisseries gagnées</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.map((user, idx) => {
                    return (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}</th>
                        <td>{user.username}</td>
                        <td>
                          {user.pastries.map((pastry, idx) => (
                            <div key={idx}>{pastry.name}</div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : user ? (
        user?.pastries.length > 0 ? (
          <div className="mt-5">
            <h5 className="text-white">Pâtisseries remportées 🍰</h5>
            {user.pastries.map((pastry, idx) => (
              <div className="text-white" key={idx}>
                {pastry.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <h5 className="text-white">
              Vous n'avez pas encore gagné de pâtisserie 😔
            </h5>
          </div>
        )
      ) : (
        <></>
      )}
      {errorMessage && <Alert errorMessage={errorMessage} />}
    </main>
  );
}

export default App;
