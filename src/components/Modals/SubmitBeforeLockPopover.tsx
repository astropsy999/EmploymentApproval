import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Container, Stack, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import React from "react";

interface SubmitBeforeLockPopoverProps {
    loading: boolean;
    handleConfirm: () => void;
    handleConfirmSubmitLock: () => void;
    handleCloseSubmitLock: () => void;
}

export const SubmitBeforeLockPopover = (props: SubmitBeforeLockPopoverProps) => {
    const { loading, handleConfirm, handleConfirmSubmitLock, handleCloseSubmitLock } = props;
    return (
        <PopupState variant="popover">
              {(popupState) => (
                <>
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="success"
                    size="large"
                    //@ts-ignore
                    onClick={handleConfirm}
                    {...bindTrigger(popupState)}
                  >
                    Да
                  </LoadingButton>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Container maxWidth="xs">
                      <Typography variant="h5" mt={2}>
                        Вы хотите заблокировать неделю сотрудникам, но у
                        некоторых внесена фактическая занятость.
                        <br />
                        <b>Согласуете перед блокировкой?</b>
                      </Typography>
                      <Stack direction={'row'} spacing={1} sx={{ p: 2, m: 1 }}>
                        <LoadingButton
                          onClick={handleConfirmSubmitLock}
                          loading={loading}
                          variant="contained"
                          color="success"
                          size="large"
                        >
                          Да
                        </LoadingButton>
                        <LoadingButton
                          onClick={handleConfirm}
                          loading={loading}
                          variant="contained"
                          color="success"
                          size="large"
                        >
                          Нет
                        </LoadingButton>
                        <Button
                          autoFocus
                          onClick={handleCloseSubmitLock}
                          variant="contained"
                          color="error"
                          size="large"
                        >
                          Отмена
                        </Button>
                      </Stack>
                    </Container>
                  </Popover>
                </>
              )}
            </PopupState>
    );
};