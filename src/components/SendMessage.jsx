import { useState } from 'react';
import { useGGridStore, useIDs } from '../store/dataStore';
import { sendMessageToUser } from '../data/api';
import { formatDateToDDMMYYYY } from '../helpers/datesRanges';
import { Box, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const SendMessage = (props) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [savedDate, setSavedDate] = useState(props.initialSavedDate);

  const { namesDatesDayIDsObj } = useIDs();

  const { ggridRef } = useGGridStore();

  const { savedMessage } = props;

  function findMaxDate(dateObject) {
    const dates = Object.keys(dateObject)?.filter((key) => key !== 'ФИО');
    if (dates.length === 0) {
      return null;
    }

    // Преобразовываем строки дат в объекты Date
    const dateValues = dates.map((dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    });

    const maxDate = new Date(Math.max(...dateValues));

    return formatDateToDDMMYYYY(maxDate);
  }

  const handleTextFieldChange = (e) => {
    setMessage(e.target.value);

    // Проверяем, есть ли текст в поле, чтобы решить, показывать кнопку или нет
    if (e.target.value.trim() !== '') {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleSend = async () => {
    setLoading(true);

    const { data } = props;

    const getSundayDate = findMaxDate(data);

    const fio = data['ФИО'].split('<')[0].trim();

    const dayId = Object?.values(
      namesDatesDayIDsObj[fio]?.filter(
        (dayIDS) => Object?.keys(dayIDS) == getSundayDate,
      )[0],
    )[0];

    try {
      // Вызываем функцию отправки сообщения и ожидаем ответ от сервера
      const response = await sendMessageToUser(
        message,
        dayId,
        getSundayDate,
        fio,
      );

      // Обновляем savedDate на основе ответа от сервера
      if (response) {
        const timestamp = new Date();
        setSavedDate(`Sent ${formatDateToDDMMYYYY(timestamp)}`);
      }

      setMessage(message);
      setShowButton(false);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setLoading(false);
    }

    setMessage('');
    setShowButton(false);
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
        noValidate
        autoComplete="on"
      >
        <TextField
          label="Сообщение"
          defaultValue={savedMessage}
          helperText={savedDate}
          size="small"
          onChange={handleTextFieldChange}
          sx={{
            width: '93%',
            margin: 0.8,
            // '& .MuiInputBase-root': {
            //   padding: '5px',
            // },
          }}
          placeholder="Введите сообщение"
          multiline
        />
        {showButton && (
          <LoadingButton
            onClick={handleSend}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{
              alignSelf: 'flex-end',
              marginTop: 1,
              marginBottom: 1,
              backgroundColor: '#42a5f6',
              '&:hover': {
                backgroundColor: '#0088D1',
              },
            }}
          >
            <span>Отправить</span>
          </LoadingButton>
        )}
      </Box>
    </div>
  );
};

export default SendMessage;
