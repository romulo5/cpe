const request = require("request");
const isEmpty = require('lodash.isempty');
const appRouter = app => {
  app.get("/", function(req, res) {
    const cpf = req.param("cpf");
    const cnpj = req.param("cnpj");
    const service_url =
      "https://apicpe.sebrae.com.br/v1/pessoasjuridicas/cpf-responsavel/";

    request.get(service_url + cpf, (error, response, body) => {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode);
      const data = JSON.parse(body);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if (response.statusCode === 403) {
        res.status(200).send({match: false});
    } else if (response.statusCode === 200 && !isEmpty(data)) {
      const cnpj_from_response = data[0].cnpj;   
      console.log(cnpj_from_response)
      res.status(200).send({ match: cnpj === cnpj_from_response});
      } else {
        res.status(200).send({match: false})
      }
    });
  });
};

module.exports = appRouter;
