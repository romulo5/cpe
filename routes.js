const request = require("request");
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
      const cnpj_from_response = data[0].cnpj;
      if (response.statusCode === 403) {
        res.status(200).send(body);
      } else if (cnpj == cnpj_from_response) {
        res.status(200).send({ match: true });
      } else {
        res.status(200).send({ match: false });
      }
    });
  });
};

module.exports = appRouter;
