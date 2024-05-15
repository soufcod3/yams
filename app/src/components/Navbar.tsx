import { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";

interface IForm {
  mail?: string;
  username: string;
  password: string;
}

export const Navbar = (props: any) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);

  const [formValues, setFormValues] = useState<IForm>({
    mail: "",
    username: "",
    password: "",
  });

  const handleSubmit = () => {
    if (isLogIn) {
      axios.post("http://localhost:8000/login", formValues).then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
        props.setUser(res.data.user)
      })
      .catch(err => {
        console.log('error login', err)
        props.setErrorMessage(err.response.data)
    });
    } else {
      axios
        .post("http://localhost:8000/signin", formValues)
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("token", token);
          props.setUser(res.data.user);
        })
        .catch((err) => props.setErrorMessage(err.response.data));
    }
  };

  return (
    <nav className="py-2 bg-black text-white">
      {props.username ? (
        <>
          <p>Connecté en tant que <strong>{props.username}</strong></p>
          <p className="link" onClick={() => {props.setUser(undefined); localStorage.removeItem('token')}}>Se déconnecter</p>
        </>
      ) : isLogIn || isSignIn ? (
        <>
          <div className="d-flex gap-3 justify-content-center">
            <p className="link" onClick={() => handleSubmit()}>
              Valider
            </p>
            <p
              className="link"
              onClick={() => {
                setIsLogIn(false);
                setIsSignIn(false);
              }}
            >
              Annuler
            </p>
          </div>
          <Form className="d-flex justify-content-center gap-2">
            {isLogIn ? (
              <>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Adresse mail"
                    value={formValues.mail}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        mail: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={formValues.password}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        password: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Adresse mail"
                    value={formValues.mail}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        mail: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formBasicName">
                  <Form.Control
                    type="text"
                    placeholder="Nom"
                    value={formValues.username}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        username: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={formValues.password}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        password: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </>
      ) : (
        <div className="d-flex gap-3 justify-content-center">
          <p
            className="link"
            onClick={() => {
              setIsLogIn(false);
              setIsSignIn(true);
            }}
          >
            S'inscrire
          </p>
          <p
            className="link"
            onClick={() => {
              setIsSignIn(false);
              setIsLogIn(true);
            }}
          >
            Se connecter
          </p>
        </div>
      )}
    </nav>
  );
};
