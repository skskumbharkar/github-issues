import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoardComponent } from 'components/board';
import Grid from '@material-ui/core/Grid';
import { TimeTravelComponent } from 'components/time-travel';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { identifyWinner, isMatchDraw } from 'utils/winner';
import { BoardState, Cell } from 'models/board-state';
import {
    closeAlert,
    setupGameStatusDraw,
    setupGameStatusInProgress,
    setupGameStatusWin,
    updateSelectedMove,
} from 'stores/game/actions';
import { selectCurrentBoard, selectHistoryBoards } from 'stores/game/selectors';
import { GameStatusAlertComponent } from 'components/game-status-alert';

export type GameComponentProps = unknown;

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            flexGrow: 1,
            width: '100%',
        },
    }),
);

export const GameComponent: React.FC<GameComponentProps> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const currentBoard = useSelector(selectCurrentBoard);
    const historyBoards = useSelector(selectHistoryBoards);

    const updateGameHistory = (cells: Cell[], cellIndex: number) => {
        const winnerCellLocation = identifyWinner(cells);
        if (winnerCellLocation) {
            dispatch(setupGameStatusWin({ winnerCellLocation, cells, cellIndex }));
        } else if (isMatchDraw(cells)) {
            dispatch(setupGameStatusDraw({ cells, cellIndex }));
        } else {
            dispatch(setupGameStatusInProgress({ cells, cellIndex }));
        }
    };

    return (
        <Grid container justify="center" className={classes.container} spacing={2}>
            <BoardComponent
                updateHistory={(cells: Cell[], cellIndex: number) => updateGameHistory(cells, cellIndex)}
                currentBoard={currentBoard as BoardState}
            />
            <TimeTravelComponent
                boards={historyBoards as BoardState[]}
                updateSelectedMove={(board: BoardState) => dispatch(updateSelectedMove({ currentBoard: board }))}
            />
            {currentBoard?.closeGame?.alertState?.open && (
                <GameStatusAlertComponent
                    openDialog={currentBoard?.closeGame?.alertState?.open as boolean}
                    title={currentBoard?.closeGame?.alertState?.title as string}
                    message={currentBoard?.closeGame?.alertState?.message as string}
                    closeAlert={(open: boolean) => dispatch(closeAlert({ open }))}
                />
            )}
        </Grid>
    );
};
