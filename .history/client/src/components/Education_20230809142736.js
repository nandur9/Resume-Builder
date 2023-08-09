import React, { Component } from "react";
import {
  Button,
  Container,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { Row } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1.5),
  },
  padding: {
    padding: theme.spacing(1),
  },
});

class Education extends Component {
  state = {
    open: false,
  };

  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  save = async (e) => {
    e.preventDefault();
    try {
      const res = await this.props.save();
      if (res.status === 200) {
        this.setState({
          open: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      open: false,
    });
  };

  render() {
    const { values, handleChange, classes } = this.props;

    return (
      <Paper className={classes.padding}>
        <Card>
          <CardHeader title="Education Details" />
        </Card>
        <CardContent>
          {/* Education Form Fields */}
        </CardContent>
        <Container className={classes.margin}>
          <Row>
            {/* Buttons and Navigation */}
          </Row>
        </Container>
        <p className="text-center text-muted">Page 2</p>
        <Button variant="contained" color="primary" onClick={this.save}>
          Save
        </Button>
        <Snackbar
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <MuiAlert
            onClose={this.handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your data has been saved successfully!
          </MuiAlert>
        </Snackbar>
      </Paper>
    );
  }
}

export default withStyles(styles)(Education);
