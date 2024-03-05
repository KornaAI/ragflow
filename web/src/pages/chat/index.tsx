import { ReactComponent as ChatAppCube } from '@/assets/svg/chat-app-cube.svg';
import { useSetModalState } from '@/hooks/commonHooks';
import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  MenuProps,
  Space,
  Tag,
} from 'antd';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import classNames from 'classnames';
import { useCallback } from 'react';
import ChatConfigurationModal from './chat-configuration-modal';
import ChatContainer from './chat-container';
import {
  useClickConversationCard,
  useClickDialogCard,
  useFetchConversationList,
  useFetchDialog,
  useGetChatSearchParams,
  useHandleItemHover,
  useRemoveConversation,
  useRemoveDialog,
  useRenameConversation,
  useSelectConversationList,
  useSelectFirstDialogOnMount,
  useSetCurrentDialog,
} from './hooks';

import RenameModal from '@/components/rename-modal';
import styles from './index.less';

const Chat = () => {
  const dialogList = useSelectFirstDialogOnMount();
  const { visible, hideModal, showModal } = useSetModalState();
  const { setCurrentDialog, currentDialog } = useSetCurrentDialog();
  const { onRemoveDialog } = useRemoveDialog();
  const { onRemoveConversation } = useRemoveConversation();
  const { handleClickDialog } = useClickDialogCard();
  const { handleClickConversation } = useClickConversationCard();
  const { dialogId, conversationId } = useGetChatSearchParams();
  const { list: conversationList, addTemporaryConversation } =
    useSelectConversationList();
  const { activated, handleItemEnter, handleItemLeave } = useHandleItemHover();
  const {
    activated: conversationActivated,
    handleItemEnter: handleConversationItemEnter,
    handleItemLeave: handleConversationItemLeave,
  } = useHandleItemHover();
  const {
    conversationRenameLoading,
    initialConversationName,
    onConversationRenameOk,
    conversationRenameVisible,
    hideConversationRenameModal,
    showConversationRenameModal,
  } = useRenameConversation();

  useFetchDialog(dialogId, true);

  const handleAppCardEnter = (id: string) => () => {
    handleItemEnter(id);
  };

  const handleConversationCardEnter = (id: string) => () => {
    handleConversationItemEnter(id);
  };

  const handleShowChatConfigurationModal =
    (dialogId?: string): any =>
    (info: any) => {
      info?.domEvent?.preventDefault();
      info?.domEvent?.stopPropagation();
      if (dialogId) {
        setCurrentDialog(dialogId);
      }
      showModal();
    };

  const handleRemoveDialog =
    (dialogId: string): MenuItemProps['onClick'] =>
    ({ domEvent }) => {
      domEvent.preventDefault();
      domEvent.stopPropagation();
      onRemoveDialog([dialogId]);
    };

  const handleRemoveConversation =
    (conversationId: string): MenuItemProps['onClick'] =>
    ({ domEvent }) => {
      domEvent.preventDefault();
      domEvent.stopPropagation();
      onRemoveConversation([conversationId]);
    };

  const handleShowConversationRenameModal =
    (conversationId: string): MenuItemProps['onClick'] =>
    ({ domEvent }) => {
      domEvent.preventDefault();
      domEvent.stopPropagation();
      showConversationRenameModal(conversationId);
    };

  const handleDialogCardClick = (dialogId: string) => () => {
    handleClickDialog(dialogId);
  };

  const handleConversationCardClick = (dialogId: string) => () => {
    handleClickConversation(dialogId);
  };

  const handleCreateTemporaryConversation = useCallback(() => {
    addTemporaryConversation();
  }, [addTemporaryConversation]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      onClick: handleCreateTemporaryConversation,
      label: (
        <Space>
          <EditOutlined /> New chat
        </Space>
      ),
    },
  ];

  const buildAppItems = (dialogId: string) => {
    const appItems: MenuProps['items'] = [
      {
        key: '1',
        onClick: handleShowChatConfigurationModal(dialogId),
        label: (
          <Space>
            <EditOutlined />
            Edit
          </Space>
        ),
      },
      { type: 'divider' },
      {
        key: '2',
        onClick: handleRemoveDialog(dialogId),
        label: (
          <Space>
            <DeleteOutlined />
            Delete chat
          </Space>
        ),
      },
    ];

    return appItems;
  };

  const buildConversationItems = (conversationId: string) => {
    const appItems: MenuProps['items'] = [
      {
        key: '1',
        onClick: handleShowConversationRenameModal(conversationId),
        label: (
          <Space>
            <EditOutlined />
            Edit
          </Space>
        ),
      },
      { type: 'divider' },
      {
        key: '2',
        onClick: handleRemoveConversation(conversationId),
        label: (
          <Space>
            <DeleteOutlined />
            Delete chat
          </Space>
        ),
      },
    ];

    return appItems;
  };

  useFetchConversationList();

  return (
    <Flex className={styles.chatWrapper}>
      <Flex className={styles.chatAppWrapper}>
        <Flex flex={1} vertical>
          <Button type="primary" onClick={handleShowChatConfigurationModal()}>
            Create an Assistant
          </Button>
          <Divider></Divider>
          <Flex className={styles.chatAppContent} vertical gap={10}>
            {dialogList.map((x) => (
              <Card
                key={x.id}
                hoverable
                className={classNames(styles.chatAppCard, {
                  [styles.chatAppCardSelected]: dialogId === x.id,
                })}
                onMouseEnter={handleAppCardEnter(x.id)}
                onMouseLeave={handleItemLeave}
                onClick={handleDialogCardClick(x.id)}
              >
                <Flex justify="space-between" align="center">
                  <Space size={15}>
                    <Avatar src={x.icon} shape={'square'} />
                    <section>
                      <b>{x.name}</b>
                      <div>{x.description}</div>
                    </section>
                  </Space>
                  {activated === x.id && (
                    <section>
                      <Dropdown menu={{ items: buildAppItems(x.id) }}>
                        <ChatAppCube className={styles.cubeIcon}></ChatAppCube>
                      </Dropdown>
                    </section>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Divider type={'vertical'} className={styles.divider}></Divider>
      <Flex className={styles.chatTitleWrapper}>
        <Flex flex={1} vertical>
          <Flex
            justify={'space-between'}
            align="center"
            className={styles.chatTitle}
          >
            <Space>
              <b>Chat</b>
              <Tag>25</Tag>
            </Space>
            <Dropdown menu={{ items }}>
              <FormOutlined />
            </Dropdown>
          </Flex>
          <Divider></Divider>
          <Flex vertical gap={10} className={styles.chatTitleContent}>
            {conversationList.map((x) => (
              <Card
                key={x.id}
                hoverable
                onClick={handleConversationCardClick(x.id)}
                onMouseEnter={handleConversationCardEnter(x.id)}
                onMouseLeave={handleConversationItemLeave}
                className={classNames(styles.chatTitleCard, {
                  [styles.chatTitleCardSelected]: x.id === conversationId,
                })}
              >
                <Flex justify="space-between" align="center">
                  <div>{x.name}</div>
                  {conversationActivated === x.id && x.id !== '' && (
                    <section>
                      <Dropdown menu={{ items: buildConversationItems(x.id) }}>
                        <ChatAppCube className={styles.cubeIcon}></ChatAppCube>
                      </Dropdown>
                    </section>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Divider type={'vertical'} className={styles.divider}></Divider>
      <ChatContainer></ChatContainer>
      <ChatConfigurationModal
        visible={visible}
        showModal={showModal}
        hideModal={hideModal}
        id={currentDialog.id}
      ></ChatConfigurationModal>
      <RenameModal
        visible={conversationRenameVisible}
        hideModal={hideConversationRenameModal}
        onOk={onConversationRenameOk}
        initialName={initialConversationName}
        loading={conversationRenameLoading}
      ></RenameModal>
    </Flex>
  );
};

export default Chat;