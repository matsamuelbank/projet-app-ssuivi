import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import { Logo } from "../Logo/Logo";
import logo from '../../assets/images/logo.jpeg';
import { CardUser } from "../CardUser/CardUser";
import { LstMenu } from "../Menu/LstMenu";

export function SideBar() {
    const [open, setOpen] = useState(false);
    const userInfo = useSelector((store) => store.USERINFO.userInfo); // Récupére l'objet utilisateur complet

    useEffect(() => {
        // modifie la valeur d'open à true afin d'ajouter la classe open 
        setOpen(true);
    }, []);

    return (
        <div>
            <motion.aside 
                id="toggleAsside" 
                className={styles.toggleAsside}
                animate={{ left: open ? 0 : -250 }}
                initial={{ left: -250 }}
                transition={{ duration: 0.5 }}
            >
                <Logo logo={logo} />

                <LstMenu /> 

                <CardUser img={logo} nom={userInfo.userName} prenom={userInfo.userFirstName} /> {/* Utilisation des propriétés de l'objet utilisateur */}
            </motion.aside>
        </div>
    );
}
