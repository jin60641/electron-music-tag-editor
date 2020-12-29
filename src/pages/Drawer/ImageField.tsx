import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getType } from 'typesafe-actions';

import actions from 'store/music/actions';
import { Music } from 'store/music/types';
import { readFileSync } from 'utils/music';

interface Props {
  list: Music[],
  ids: string,
  setValue: (value?: string) => void,
}

const useStyles = makeStyles((theme) => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',
  },
  label: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    paddingTop: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: theme.palette.grey['400'],
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  drag: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '10px solid black',
    borderRadius: 4,
    display: 'none',
  },
  dragging: { display: 'block' },
}));

interface Size {
  width: number,
  height: number,
}

const getUrlFromFile = async (file: File) => new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(`${reader.result}`);
  };
  reader.readAsDataURL(file);
});

const checkImageSize = async (src: string) => new Promise<Size | null>((resolve) => {
  const image = new Image();
  image.onload = () => {
    const { width, height } = image;
    resolve({ width, height });
  };
  image.onerror = () => {
    resolve(null);
  };
  image.src = src;
});

const initialSize = { width: 0, height: 0 };

interface ContextAnchor {
  mouseX: null | number,
  mouseY: null | number,
}

const initialContextAnchor: ContextAnchor = {
  mouseX: null,
  mouseY: null,
};

const ImageInput: FC<Props> = ({
  setValue,
  ids,
  list,
}) => {
  const [init, setInit] = useState(false);
  const [contextAnchor, setContextAnchor] = React.useState<ContextAnchor>(initialContextAnchor);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [size, setSize] = useState({ ...initialSize });
  const [isFileDragging, setIsFileDragging] = useState(false);
  const classes = useStyles();

  const handleChangeUrl = useCallback(async ({
    url,
    file,
    buffer,
    isExternal,
  }: {
    url?: string,
    file?: File,
    buffer?: Uint8Array,
    isExternal?: boolean,
  }) => {
    if (!url) {
      setImgUrl(url);
      setSize({ ...initialSize });
      return;
    }
    const nextSize = await checkImageSize(url);
    if (!nextSize) {
      return;
    }
    setImgUrl(url);
    setSize(nextSize);
    if (file) {
      setValue((file as any).path);
    } else if (buffer) {
      setValue(buffer as any);
    } else if (isExternal) {
      setValue(url);
    } else {
      setValue(undefined);
    }
  }, [setValue]);

  const handleDragEnter = useCallback(() => {
    setIsFileDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsFileDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsFileDragging(true);
  }, []);

  const handleDrop = useCallback((e) => {
    setIsFileDragging(false);
    let url: string | undefined = e.dataTransfer.getData('url');
    if (e.dataTransfer.files?.length) {
      const [file] = e.dataTransfer.files;
      (async () => {
        url = await getUrlFromFile(file);
        if (url) {
          handleChangeUrl({ url, file });
        }
      })();
    } else if (url) {
      handleChangeUrl({ url, isExternal: true });
    }
  }, [handleChangeUrl]);

  const handleChangeFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    e.preventDefault();
    const [file] = e.target.files || [];
    if (!file) {
      return;
    }

    const url = await getUrlFromFile(file);
    if (url) {
      handleChangeUrl({ url, file });
    }
    e.target.value = '';
    e.target.files = null;
  }, [handleChangeUrl]);

  const defaultValue = useMemo(() => {
    if (!ids || list.length !== 1) {
      return undefined;
    }
    return list[0].metadata.picture;
  }, [list, ids]);

  useEffect(() => {
    if (!init && !!ids && list.length === 1 && list[0].metadata && !list[0].metadata.picture?.[0]) {
      window.bridge.ipc.send(getType(actions.addMusic.request), list[0].path);
      setInit(true);
    }
  }, [list, ids, init]);

  useEffect(() => {
    if (ids) {
      setInit(false);
    }
  }, [ids]);

  const handlePictureRightClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setContextAnchor({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };

  const handleClose = useCallback(() => {
    setContextAnchor({ ...initialContextAnchor });
  }, []);

  const handleDelete = useCallback(() => {
    setValue('');
    handleChangeUrl({ url: '' });
    handleClose();
  }, [handleClose, setValue, handleChangeUrl]);

  const handleCopy = useCallback(() => {
    if (imgUrl) {
      window.bridge.copyImage(imgUrl);
    }
    handleClose();
  }, [handleClose, imgUrl]);

  const handlePaste = useCallback(async () => {
    const buffer = window.bridge.pasteImage();
    if (buffer?.length) {
      const blob = new Blob([buffer], { type: 'image/png' });
      const url = await readFileSync(blob);
      handleChangeUrl({ url, buffer });
    }
    handleClose();
  }, [handleClose, handleChangeUrl]);

  useEffect(() => {
    if (!(defaultValue instanceof Uint8Array)) {
      setImgUrl((n) => (n === defaultValue ? n : undefined));
      handleChangeUrl({ url: defaultValue });
    }
  }, [defaultValue, handleChangeUrl]);

  return (
    <>
      <div
        className={classes.wrap}
      >
        <label
          htmlFor='file'
          className={classes.label}
          style={imgUrl ? { backgroundImage: `url('${imgUrl}')` } : undefined}
          onDragEnter={handleDragEnter}
          onContextMenu={handlePictureRightClick}
        >
          <input
            type='file'
            id='file'
            hidden
            accept='image/jpeg, image/png'
            onChange={handleChangeFile}
          />
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={clsx(
              classes.drag,
              isFileDragging && classes.dragging,
            )}
          />
        </label>
        {imgUrl === undefined && (
          <div>
            (유지)
          </div>
        )}
        {imgUrl && (
          <div>
            {size.width}
            x
            {size.height}
          </div>
        )}
      </div>
      <Menu
        keepMounted
        open={contextAnchor.mouseY !== null}
        onClose={handleClose}
        anchorReference='anchorPosition'
        anchorPosition={
          contextAnchor.mouseY !== null && contextAnchor.mouseX !== null
            ? { top: contextAnchor.mouseY, left: contextAnchor.mouseX }
            : undefined
        }
      >
        {!!imgUrl && <MenuItem onClick={handleCopy}>복사</MenuItem>}
        <MenuItem onClick={handlePaste}>붙여넣기</MenuItem>
        {!!imgUrl && (
          <MenuItem
            component='a'
            href={imgUrl}
            onClick={handleClose}
            download
          >
            다운로드
          </MenuItem>
        )}
        {!!imgUrl && (
          <MenuItem onClick={handleDelete}>제거</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ImageInput;
