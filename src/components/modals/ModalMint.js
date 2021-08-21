import NumericInput from "../inputs/NumericInput";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import { FaTimes } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import SubmitButton from "../SubmitButton";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "fit-content",
    position: "relative",
    width: 500,
    backgroundColor: "#424242",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "inline-flex",
  },
  exit: {
    color: "red",
    cursor: "pointer",
  },
  btn: {
    margin: theme.spacing(2, 2, 2),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
}));

const ModalMint = ({ token, handleMint }) => {
  const classes = useStyles();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errorMsg, updateErrorMsg] = useState("");
  const [wait, setWait] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleMintSubmit = async (e) => {
    e.preventDefault();

    const bal = e.target.elements.NumericInput.value.trim() * 1;
    if (token === null) updateErrorMsg("Which token???");
    else if (bal === 0) updateErrorMsg("Pick value >0 to send.");
    else {
      setWait(true);
      const res = await handleMint(bal);
      !res && updateErrorMsg("Error happened check metamask for more info.");
      setWait(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        className={classes.btn}
        onClick={openModal}
      >
        Mint
      </Button>

      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <form onSubmit={handleMintSubmit}>
          <div className="container">
            <div className="Transfer">
              <h2 id="simple-modal-title">Mint</h2>
            </div>
            <div className="B">
              <FaTimes
                className={classes.exit}
                onClick={closeModal}
                size="40px"
              />
            </div>

            <div className="balance simple-modal-description">
              {token ? (
                <p>
                  Current balance: {token.balance} {token.symbol}
                </p>
              ) : (
                <p>Pick token first</p>
              )}
            </div>

            <div className="address simple-modal-description"></div>
            <div className="balanceToSend simple-modal-description">
              <NumericInput />
            </div>

            <div className="msg">
              <p>{errorMsg}</p>
            </div>

            <div className="SumbmitButton simple-modal-description">
              <SubmitButton wait={wait} text="Mint" />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalMint;
