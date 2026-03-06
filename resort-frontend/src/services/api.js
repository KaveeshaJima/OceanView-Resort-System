import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/resort-management-ee/api",
});

// හැම Request එකකටම Token එක auto එකතු කරන විදිහ පස්සේ මේකට දාමු
export default api;