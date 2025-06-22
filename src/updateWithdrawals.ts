import axios from "axios";

async function updateWithdrawals() {
  try {
    await axios.get(process.env.AUTH_URL + "/api/bog/withdraw/update");
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }

  try {
    await axios.get(process.env.AUTH_URL + "/api/bog/referal-withdraw/update");
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }

  try {
    await axios.get(process.env.AUTH_URL + "/api/tbc/referal-withdraw/update");
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }

  try {
    await axios.get(process.env.AUTH_URL + "/api/tbc/withdraw/update");
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
}

export default updateWithdrawals;
