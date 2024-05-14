import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';

const app = express();
const port = process.env.PORT || 3000;

// Multer configuration to accept only CSV files
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

let usersData: Array<Record<string,string>> = []

app.post('/api/files', upload.single('file') ,async (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: 'File uploaded successfully' });
    // 1 Extract the file from the request
    const {file} = req;
    // 2 Validate that we have the file
    if (!file) {
        return res.status(500).send({ message: 'File is required' });
    }
    // 3 Validate type file
    if (file.mimetype !== 'text/csv') {
        return res.status(500).send({ message: 'File type is not supported' });
    }
    // 4 Transform the file to string
    let json: Array<Record<string,string>>  = [];
    try {
       const csv = Buffer.from(file.buffer).toString('utf-8');
       console.log(csv);
        // 5 Transfomr the string to JSON
        // 6 Save the json to db
       json = csvToJson.csvStringToJson(csv);
       usersData = json;
        
    } catch (error) {
        return res.status(500).send({ message: 'Error parsing the file' });
    }
    // 7 Return code 200 with a message 'File uploaded successfully' and the json
    res.status(200).send({ message: 'File uploaded successfully', data: json });

    })

app.get('/api/users', async (req, res) => {
    // 1 Extract the query param q from the request
    const {q} = req.query;
    // 2 Validate that we have the query param
    if (!q) {
        return res.status(500).send({ message: 'Query param is required' });
    }
    if (typeof q !== 'string') {
        return res.status(500).send({ message: 'Query param must be a string' });
    }
    // 3 Filter data from db with the query param
    const search = q.toLowerCase();
    const filteredData = usersData.filter((row) => {
       return Object
        .values(row)
        .some((value) => value.toLowerCase().includes(search));
    })

    // 4 Return code 200 with the filtered data
        return res.status(200).json({ data : filteredData });
    })


app.listen(port, () => {
    console.log(`Server is hosted on http://localhost:${port}`);
});

