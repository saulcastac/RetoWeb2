// server/index.js
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

app.get("/api/gsong/:id", (req, res) => {
  const songId = req.params.id;
  fs.readFile( __dirname + "/" + "song.json", "utf8", (err, data) => {
    if (err) throw err;
    const songs = JSON.parse(data);
    const song = songs.find(song => song.id === songId);
    console.log(song);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.json(song);
  });
});

app.post("/api/psong", (req, res) => {
  console.log('El cuerpo de la peticion:', req.body);
});

// Definir un endpoint PUT que permita actualizar una canción existente
app.put("/api/usong/:id", (req, res) => {
  // Obtener el identificador de la canción a actualizar desde la URL
  const songId = req.params.id;
  // Obtener los nuevos datos de la canción desde el cuerpo de la solicitud
  const newSong = req.body;

  // Leer el archivo "song.json"
  fs.readFile(__dirname + "/song.json", "utf8", (err, data) => {
    if (err) {
      // Manejar errores al leer el archivo
      console.error(err);
      res.status(500).json({ error: "Error reading file" });
      return;
    }

    // Analizar los datos del archivo como un array de canciones
    let songs = JSON.parse(data);
    // Encontrar el índice de la canción correspondiente al identificador especificado
    const songIndex = songs.findIndex((song) => song.id === songId);

    if (songIndex === -1) {
      // Manejar el caso en que no se encuentra la canción
      res.status(404).json({ error: "Song not found" });
      return;
    }

    // Actualizar los datos de la canción correspondiente con los nuevos datos
    songs[songIndex] = { ...songs[songIndex], ...newSong };
    // Escribir los datos actualizados en el archivo "song.json"
    fs.writeFile(__dirname + "/song.json", JSON.stringify(songs), (err) => {
      if (err) {
        // Manejar errores al escribir el archivo
        console.error(err);
        res.status(500).json({ error: "Error writing file" });
        return;
      }

      // Devolver una respuesta JSON que indica que la canción se actualizó correctamente
      res.json({ message: "Song updated successfully" });
    });
  });
});


app.delete("/api/dsong/:id", (req, res) => {
  const id = req.params.id; // Obtiene el ID del parámetro de la URL

  // Lee los datos del archivo JSON
  fs.readFile(__dirname + "/song.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Parsea los datos como un array de objetos
    const songs = JSON.parse(data);

    // Busca el índice de la canción con el ID especificado
    const songIndex = songs.findIndex((song) => song.id === id);

    // Si la canción no existe, retorna un error 404
    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Remueve la canción del array
    songs.splice(songIndex, 1);

    // Escribe los datos actualizados en el archivo JSON
    fs.writeFile(__dirname + "/song.json", JSON.stringify(songs), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Retorna una respuesta 200 OK
      return res.status(200).json({ message: "Song deleted successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});