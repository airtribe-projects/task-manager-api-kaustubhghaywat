fs.readFile('task.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading tasks');
        }
        res.send(data);
    })