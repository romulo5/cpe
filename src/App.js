import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MaskedInput from "react-text-mask";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import logo from "./logo.jpg"
import axios from "axios";
import isNil from 'lodash.isnil';
import isEmpty from 'lodash.isempty';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  logo: {
    height: "50px"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
    height: "80%"
  }
});

function TextMaskCPF(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/
      ]}
      placeholderChar={"\u2000"}
      guide={false}
      showMask
    />
  );
}

TextMaskCPF.propTypes = {
  inputRef: PropTypes.func.isRequired
};

function TextMaskCNPJ(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      guide={false}
      showMask
    />
  );
}

TextMaskCNPJ.propTypes = {
  inputRef: PropTypes.func.isRequired
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: false,
      loaded: false,
      cpf: "",
      cnpj: ""
    };
    this.baseState = this.state 
  }
  
  resetState = () => {
    this.setState(this.baseState)
  }
  checkCNPJwithCPF = (rawCPF,rawCNPJ) => {
    const url = "https://apicpe.sebrae.com.br/v1/pessoasjuridicas/cpf-responsavel/";
    const cpf = this.sanitize(rawCPF);
    const cnpj = this.sanitize(rawCNPJ);
    const update = (field, value) => {
      this.setState({
        [field]: value
      })
    }
    axios.get(url + cpf)
    .then(function (response) {
        const cnpjFromServer =  !isEmpty(response.data) ? response.data[0].cnpj : ""; 
        console.log(cnpjFromServer)
          if (cnpj === cnpjFromServer){
            update("match", true);
            update("loaded", true);
          } else {
          update("loaded",true);
          update("match", false);
          }
    })
    .catch(function (error) {
    })
    .then(function () {
    });  
  }

  sanitize = (string) => {
    let s = string.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    return s.replace(/\s{2,}/g," ");
  };
   
  handleChange = name => event => {
    event.preventDefault();
    this.setState({
      [name]: event.target.value
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.checkCNPJwithCPF(this.state.cpf,this.state.cnpj)
 }

 componentWillUnmount() {
  this.resetState();
}
  render() {
    const { classes } = this.props;
      return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <img src={logo} className={classes.logo} alt="Logo" />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h3>Verificar Vínculo - CPF / CNPJ</h3>
              <br/>
              <form >
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="cpf" shrink className={classes.textField}>
                    CPF
                  </InputLabel>
                  <Input 
                    id="cpf"
                    className={classes.textField}
                    placeholder="Insira o CPF"
                    onChange={this.handleChange("cpf")}
                    inputComponent={TextMaskCPF}
                    type='text'
                    // error={cpf === ""}
                    // helperText={cpf === "" ? 'Digite um CPF' : ' '}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="cnpj" shrink className={classes.textField}>
                   CNPJ
                  </InputLabel>
                  <Input
                  id="CNPJ"
                  className={classes.textField}
                  placeholder="Insira o CNPJ"
                  onChange={this.handleChange("cnpj")}
                  inputComponent={TextMaskCNPJ}
                  // error={cnpj === ""}
                  // helperText={cnpj === "" ? 'Digite um CNPJ' : ' '}
                />
                </FormControl>
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                  className={classes.button}               >
                  Enviar
                </Button>
                </form>
             
               {this.state.match && <h4>CPF e CNPJ vinculados</h4> } 
               {!this.state.match && this.state.loaded && <h4> CPF e CNPJ não vinculados</h4>}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
