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
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from "axios";
import isEmpty from "lodash.isempty";
import validarCpf from './validar'
import 'typeface-roboto'
import logo from "./logo.jpg";

const styles = theme => ({
  root: {
    flexGrow: 1,
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
  },
  formControl: {
   
  },
  error: {
    paddingLeft: theme.spacing.unit,
    color: 'red'
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
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "/",
        /\d/,
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
      cnpj: "",
      cpferror: false,
      cnpjerror: false,
      loading: false,
      show: false
    };
    this.baseState = this.state;
  }

  resetState = () => {
    this.setState({});
  };

  checkCNPJwithCPF = (rawCPF, rawCNPJ) => {
    const url =
      "http://api-vinculosocietario.sebrae.com.br/";
    const cpf = this.sanitize(rawCPF);
    const cnpj = this.sanitize(rawCNPJ);
    const updateState = (field, value) => {
      this.setState({
        [field]: value
      });
    };
    axios
      .get(url + "?cpf=" + cpf + "?cnpj=" + cnpj)
      .then(function(response) {
        const match = response.data.match 
        console.log(response.data)
        // const cnpjFromServer = !isEmpty(response.data)
        //   ? response.data[0].cnpj
        //   : "";
        // console.log(cnpjFromServer);
      
        // if (cnpj === cnpjFromServer) {
        //   updateState("match", true);
        //   updateState("loaded", true);
        // } else {
        //   updateState("loaded", true);
        //   updateState("match", false);
        // }
     
        
      })
      .catch(function(error) {})
      .then(function(){
        updateState("loading", false)
        updateState("show", true)
      });
  };

  sanitize = string => {
    let s = string.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    return s.replace(/\s{2,}/g, " ");
  };

  handleChange = name => event => {
    event.preventDefault();
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.cpferror && !this.state.cnpjerror) {
      this.setState({
        loading:true
      })
      this.checkCNPJwithCPF(this.state.cpf, this.state.cnpj);
    }
  };

  componentWillUnmount() {
    this.resetState();
  }

  validate = () => {
    const validCpf = validarCpf(this.state.cpf);
    this.setState({
      cpferror: this.state.cpf.length === 0 || this.state.cpf.length < 14 || !validCpf,
      cnpjerror: this.state.cnpj.length === 0 || this.state.cnpj.length < 18,
      show: false
    });
  };
  render() {
    const { classes } = this.props;
    const validData = !this.state.cpferror && !this.state.cnpjerror;
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
              <br />
              <form>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="cpf"
                    shrink
                    className={classes.textField}
                  >
                    CPF
                  </InputLabel>
                  <Input
                    id="cpf"
                    className={classes.textField}
                    placeholder="Insira o CPF"
                    onChange={this.handleChange("cpf")}
                    inputComponent={TextMaskCPF}
                    type="text"
                    error={this.state.cpferror}
                    onBlur={this.validate}
                  />
                  {this.state.cpferror && <h5 className={classes.error}>CPF inválido</h5>}
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="cnpj"
                    shrink
                    className={classes.textField}
                  >
                    CNPJ
                  </InputLabel>
                  <Input
                    id="CNPJ"
                    className={classes.textField}
                    placeholder="Insira o CNPJ"
                    onChange={this.handleChange("cnpj")}
                    inputComponent={TextMaskCNPJ}
                    error={this.state.cnpjerror}
                    onBlur={this.validate}
                  />
                  {this.state.cnpjerror && <h5 className={classes.error} >CNPJ inválido</h5>}
                </FormControl>
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Enviar
                </Button>
              </form>
              <Grid item xs={4}>
              {this.state.loading &&  <LinearProgress variant="query" />}
              {this.state.show &&
                this.state.match && 
              this.state.loaded && 
              validData && <h4>CPF e CNPJ vinculados</h4>}
              {this.state.show &&
                !this.state.match &&
                this.state.loaded &&
                 validData && <h4> CPF e CNPJ não vinculados</h4>}
                </Grid>
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
