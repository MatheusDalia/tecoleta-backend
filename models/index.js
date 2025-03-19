const User = require("./User");
const Obra = require("./Obra");
const ObraColaborador = require("./ObraColaborador");
const Atividade = require("./Atividade");

// Executar as associações
if (User.associate) {
  User.associate({ User, Obra, ObraColaborador, Atividade });
}

if (Obra.associate) {
  Obra.associate({ User, Obra, ObraColaborador, Atividade });
}

if (Atividade.associate) {
  Atividade.associate({ User, Obra, ObraColaborador, Atividade });
}

module.exports = {
  User,
  Obra,
  ObraColaborador,
  Atividade,
};
