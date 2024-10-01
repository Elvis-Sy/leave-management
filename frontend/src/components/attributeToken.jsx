import jwt from 'jsonwebtoken';

const secret = 'congeSPAT';

export const getAttributesToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded; // Retourne tous les attributs du token
    } catch (error) {
        if (error && error.name === 'TokenExpiredError') {
            console.error('Token expired:', error.message);
        } else if (error && error.name === 'JsonWebTokenError') {
            console.error('Invalid token:', error.message);
        } else {
            console.error('Error verifying token:', error); // Affiche l'erreur complète
        }
        return null;
    }
};