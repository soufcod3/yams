export const Alert = (props: any) => {

    return <div className="alert alert-danger position-absolute end-0 bottom-0 m-3" role="alert">
      <h4 className="alert-heading">Erreur</h4>
      <p>{props.errorMessage}</p>
      <hr/>
      <p className="mb-0">Veuillez réessayer.</p>
    </div>
}