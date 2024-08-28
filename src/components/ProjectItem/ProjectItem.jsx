import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function ProjectItem({ nameProject, descriptionProject, startDate, limitDate, creatorUser, onClick,buttonText }) {

    return (
        <Box sx={{ minWidth: 275, mb: 2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {nameProject}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {descriptionProject}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Début: {startDate}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Fin: {limitDate}
                    </Typography>
                    <Typography variant="body2">
                        Créé par {creatorUser}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={onClick} size="small">{buttonText}</Button>
                </CardActions>
            </Card>
        </Box>
    );
}
