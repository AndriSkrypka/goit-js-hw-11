import axios from 'axios';
import Notiflix from 'notiflix';
export default async function fetchImg(value, page) {
  try {
    const response = await axios({
      url: `https://pixabay.com/api/`,
      params: {
        key: '28349492-852ddd1eacec879b1ac2fb90f',
        q: value,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
