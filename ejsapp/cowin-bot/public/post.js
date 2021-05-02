// import 'regenerator-runtime/runtime';
// import axios from 'axios';

const BASE_URL = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts';

const getDistricts = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        console.log(response.data)
        // const todoItems = response.data;
        // console.log(`GET: Here's the list of todos`, todoItems);

        return response.data;
    } catch (errors) {
        console.error(errors);
    }
};

let select = document.querySelector('#states'),
    input = document.querySelector('input[type="button"]');
select.addEventListener('change', async function (event) {
    let e = document.getElementById("states");
    // console.log(e.value);
    let dist = await getDistricts(e.value);
    console.log(dist.districts);
    let x = document.getElementById("dist");
    for (var ii = x.length-1; ii >= 0 ; ii--) {
        x.remove(ii);
    }
    let i;
    console.log(dist.districts[0]);
    // console.log(dist.districts[0].district_name);
    for (i = 0; i < dist.districts.length; i++) {
        var option = document.createElement("option");
        option.text = dist.districts[i].district_name;
        option.value = dist.districts[i].district_id;
        // console.log(option);
        x.add(option);
    }
});