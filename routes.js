const request = require("request");
const appRouter = app => {
  app.get("/busca", function(req, res) {
    const cpf = req.param("cpf");
    const cnpj = req.param("cnpj") 
    const service_url =
      "https://apicpe.sebrae.com.br/v1/pessoasjuridicas/cpf-responsavel/";
 
   request.get(service_url + cpf, (error, response, body) => {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); 
      res.status(200).send(body.cnpj);
//	body[0].cnpj === cnpj ?  
  //  res.status(200).send(body[0].cnpj === cnpj) :
    //res.status(200).send(body[0].cnpj + " \n" + body);
    });
  });
}

module.exports = appRouter;
