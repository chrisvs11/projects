export class MovieService {

  get keyApi () {
      return process.env.REACT_APP_API_KEY
  }

  
}

const instance = new MovieService()

export default instance