function status(request, response) {
  response.status(200).json({ frase: "Hello World o/ o/" });
}

export default status;
