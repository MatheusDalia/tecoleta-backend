const User = require("./User");
const Obra = require("./Obra");
const ObraColaborador = require("./ObraColaborador");
const Atividade = require("./Atividade");
const Servico = require("./Servico");

// Executar as associações
if (User.associate) {
  User.associate({ User, Obra, ObraColaborador, Atividade, Servico });
}

if (Obra.associate) {
  Obra.associate({ User, Obra, ObraColaborador, Atividade, Servico });
}

if (Atividade.associate) {
  Atividade.associate({ User, Obra, ObraColaborador, Atividade, Servico });
}

if (Servico.associate) {
  Servico.associate({ User, Obra, ObraColaborador, Atividade, Servico });
}

module.exports = {
  User,
  Obra,
  ObraColaborador,
  Atividade,
  Servico,
};
