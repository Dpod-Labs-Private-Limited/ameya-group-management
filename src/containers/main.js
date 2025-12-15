import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Box, Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, TextField,
    Snackbar, Alert, Chip, Skeleton, LinearProgress, TableContainer, IconButton
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

import {
    Group as GroupIcon, PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon,
    Search as SearchIcon, ArrowBack as ArrowBackIcon, Refresh as RefreshIcon
} from "@mui/icons-material";

import { fetchGroupDetails, fetchGroupMembersByGroup, fetchUserAppAccess, fetchUserDetails } from "../utils/index";
import GroupApi from "../api/services/GroupService";
import { getMainStyles } from "../styles/mainStyles";

export default function GroupManagement(props) {

    const theme = useTheme();
    const mainStyle = getMainStyles(theme);

    const appflyteDetails = useMemo(() => ({
        appflyte_account_id: props?.appflyte_account_id ?? null,
        appflyte_subscriber_id: props?.appflyte_subscriber_id ?? null,
        appflyte_subscription_id: props?.appflyte_subscription_id ?? null,
        appflyte_backend_url: props?.appflyte_backend_url ?? null,
        appflyte_schema_id: props?.appflyte_schema_id ?? null,
        appflyte_dpod_token: props?.appflyte_dpod_token ?? null,
        appflyte_organization_id: props?.appflyte_organization_id ?? null,
        appflyte_app_name: "BugTracker" ?? null
    }), [props]);

    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [searchGroup, setSearchGroup] = useState("");
    const [searchMember, setSearchMember] = useState("");
    const [selectedUserToAdd, setSelectedUserToAdd] = useState("");

    const showNotification = useCallback((message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    const loadGroups = useCallback(async () => {
        setGroupsLoading(true);
        try {
            const data = await fetchGroupDetails(appflyteDetails);
            setGroups(data || []);
        } catch (err) {
            console.error("Failed to load groups:", err);
            showNotification("Failed to load groups", "error");
        } finally {
            setGroupsLoading(false);
        }
    }, [appflyteDetails, showNotification]);

    const loadAllUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const [userData, userAppAccessData] = await Promise.all([
                fetchUserDetails(appflyteDetails),
                fetchUserAppAccess(appflyteDetails)
            ])
            const filteredAppAccess = (userAppAccessData || []).filter(appAccess => appAccess?.payload?.app_name === appflyteDetails.appflyte_app_name);
            const filteredUserIds = (filteredAppAccess || []).map(appAccess => appAccess?.payload?.user_id);
            const filteredUsers = (userData || []).filter(user => filteredUserIds.includes(user?.payload?.user_id));
            setAllUsers(filteredUsers || []);
        } catch (err) {
            console.error("Failed to load users:", err);
            showNotification("Failed to load users", "error");
        } finally {
            setUsersLoading(false);
        }
    }, [appflyteDetails, showNotification]);

    const handleViewMembers = useCallback(async (group) => {
        if (selectedGroup?.payload?.__auto_id__ === group.payload?.__auto_id__) {
            handleBack();
            return;
        }

        setMembersLoading(true);
        setSelectedGroup(group);
        try {
            const data = await fetchGroupMembersByGroup(appflyteDetails, group?.payload?.__auto_id__);
            setMembers(data || []);
            await loadAllUsers();
        } catch (err) {
            console.error("Failed to load members:", err);
            showNotification("Failed to load members", "error");
        } finally {
            setMembersLoading(false);
        }
    }, [appflyteDetails, selectedGroup, showNotification, loadAllUsers]);

    const handleBack = useCallback(() => {
        setSelectedGroup(null);
        setMembers([]);
        setSearchMember("");
        setSelectedUserToAdd("");
        setMembersLoading(false);
        setUsersLoading(false);
    }, []);


    const handleRemoveMember = useCallback(async (userId) => {
        if (!confirm(`Remove this user from ${selectedGroup?.payload?.name}?`)) return;

        setMembersLoading(true);
        try {
            const memberToRemove = members.find(m => {
                const memberUserId = (m?.payload?.user || [])?.at(-1);
                return memberUserId === userId;
            });

            if (!memberToRemove) {
                showNotification("Member not found", "error");
                return;
            }

            const item_id = memberToRemove?.payload?.__auto_id__;
            const item_update_key = memberToRemove?.update_key;

            const reqObj = {
                "id": item_id,
                "fields": [
                    { "path": "$.user", "value": [] },
                    { "path": "$.group", "value": [] }
                ]
            };

            const groupUpdateResponse = await GroupApi.updateMembers(appflyteDetails, item_id, item_update_key, JSON.stringify(reqObj));
            if (groupUpdateResponse.status !== 200) {
                showNotification("Failed to remove member", "error");
                return;
            }

            const groupDeleteResponse = await GroupApi.deleteMembers(appflyteDetails, item_id);
            if (groupDeleteResponse.status === 200) {
                setMembers(prev => prev.filter(m => m.payload?.__auto_id__ !== item_id));
                loadGroups();
                showNotification("Member removed successfully", "success");
            }
        } catch (err) {
            console.error("Remove member error:", err);
            showNotification("Failed to remove member", "error");
        } finally {
            setMembersLoading(false);
        }
    }, [members, selectedGroup, appflyteDetails, showNotification]);

    const handleAddMember = useCallback(async (userId) => {
        setMembersLoading(true);
        try {
            const isAlreadyMember = members.some(m => {
                const memberUserId = (m?.payload?.user || [])?.at(-1);
                return memberUserId === userId;
            });

            if (isAlreadyMember) {
                showNotification("User is already a member", "warning");
                return;
            }

            const reqObj = {
                "collection_item": {
                    "has_been_muted": false,
                    "is_active": true,
                    "user": [userId],
                    "group": [selectedGroup?.payload?.__auto_id__]
                }
            };

            const groupResponse = await GroupApi.addMembers(appflyteDetails, JSON.stringify(reqObj));
            if (groupResponse.status === 200) {
                const data = await fetchGroupMembersByGroup(appflyteDetails, selectedGroup?.payload?.__auto_id__);
                setMembers(data || []);
                loadGroups();
                showNotification("Member added successfully", "success");
                setSelectedUserToAdd("");
            }
        } catch (err) {
            console.error("Add member error:", err);
            showNotification("Failed to add member", "error");
        } finally {
            setMembersLoading(false);
        }
    }, [members, selectedGroup, appflyteDetails, showNotification]);

    // Memos
    const availableUsers = useMemo(() => {
        const memberUserIds = members.map(m => (m?.payload?.user || [])?.at(-1)).filter(Boolean);
        return allUsers.filter(u => !memberUserIds.includes(u?.payload?.__auto_id__));
    }, [allUsers, members]);

    const filteredGroups = useMemo(() => {
        if (!searchGroup.trim()) return groups;
        const s = searchGroup.toLowerCase();
        return groups.filter(g => g?.payload?.name?.toLowerCase().includes(s));
    }, [groups, searchGroup]);

    const filteredMembers = useMemo(() => {
        if (!searchMember.trim()) return members;
        const s = searchMember.toLowerCase();
        return members.filter(m => {
            const userId = (m?.payload?.user || [])?.at(-1);
            const user = allUsers.find(u => u?.payload?.__auto_id__ === userId);
            const text = (user?.payload?.name || user?.payload?.email || userId || "").toLowerCase();
            return text.includes(s);
        });
    }, [members, searchMember, allUsers]);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    return (
        <Container maxWidth="xl" sx={{ py: 4, height: '100vh' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 3, flexShrink: 0 }}>
                    {!selectedGroup ? (
                        <>
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <GroupIcon sx={{ fontSize: 48, }} />
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        Groups Management
                                    </Typography>
                                    <Typography variant="body2">
                                        View and manage your groups
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" gap={2} alignItems="center">
                                <TextField
                                    size="small"
                                    sx={{ flex: 1, maxWidth: 400, ...mainStyle.textField }}
                                    value={searchGroup}
                                    onChange={e => setSearchGroup(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1 }} />
                                    }}
                                />
                                <IconButton
                                    onClick={loadGroups}
                                    disabled={groupsLoading}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <IconButton onClick={handleBack}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <GroupIcon sx={{ fontSize: 48 }} />
                                <Box flex={1}>
                                    <Typography variant="h4" fontWeight={700}>
                                        {selectedGroup?.payload?.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Manage group members ({members.length} total)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" gap={2} alignItems="flex-start" flexWrap="wrap">
                                <TextField
                                    size="small"
                                    sx={{ flex: 1, minWidth: 250, ...mainStyle.textField }}
                                    value={searchMember}
                                    onChange={e => setSearchMember(e.target.value)}
                                    disabled={membersLoading}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1 }} />
                                    }}
                                />

                                <Box display="flex" gap={2} alignItems="center">
                                    <FormControl size="small" sx={{ minWidth: 250 }}>
                                        <InputLabel>Add Member</InputLabel>
                                        <Select
                                            value={selectedUserToAdd}
                                            onChange={e => setSelectedUserToAdd(e.target.value)}
                                            disabled={usersLoading || availableUsers.length === 0}
                                            label="Add Member"
                                            sx={mainStyle.selectField}
                                        >
                                            {availableUsers.map(u => (
                                                <MenuItem key={u?.payload?.__auto_id__} value={u?.payload?.__auto_id__}>
                                                    <Box>
                                                        <Typography fontWeight={500}>
                                                            {u.payload?.name || u.payload?.email}
                                                        </Typography>
                                                        {u.payload?.name && u.payload?.email && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {u.payload.email}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAddMember(selectedUserToAdd)}
                                        disabled={!selectedUserToAdd || usersLoading || membersLoading}
                                        startIcon={<PersonAddIcon />}
                                        sx={{ height: 40 }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>

                            {availableUsers.length === 0 && !usersLoading && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    All users are already members of this group
                                </Alert>
                            )}
                        </>
                    )}
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2
                    }}
                >
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        {!selectedGroup ? (
                            groupsLoading ? (
                                <Box sx={{ p: 3 }}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                                    ))}
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Group Name</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Members</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredGroups.map(group => (
                                                <TableRow key={group?.payload?.__auto_id__} hover>
                                                    <TableCell>
                                                        <Typography fontWeight={600}>
                                                            {group?.payload?.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={(group.payload?.group_members || [])?.length || 0}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleViewMembers(group)}
                                                            sx={{ minWidth: 120 }}
                                                        >
                                                            View Members
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredGroups.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                                        <Typography color="text.secondary" variant="h6">
                                                            {searchGroup ? "No groups match your search" : "No groups found"}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        ) : (
                            membersLoading ? (
                                <Box sx={{ p: 3 }}>
                                    <LinearProgress sx={{ mb: 3 }} />
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                                    ))}
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Name</TableCell>
                                                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Email</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredMembers.map((member) => {
                                                const userId = (member?.payload?.user || [])?.at(-1);
                                                const user = allUsers.find(u => u?.payload?.__auto_id__ === userId);

                                                return (
                                                    <TableRow key={member?.payload?.__auto_id__} hover>
                                                        <TableCell>
                                                            <Typography fontWeight={500}>
                                                                {user?.payload?.name || 'Unknown User'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography color="text.secondary">
                                                                {user?.payload?.email || '-'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleRemoveMember(userId)}
                                                                startIcon={<PersonRemoveIcon />}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {filteredMembers.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                                        <Typography color="text.secondary" variant="h6">
                                                            {searchMember ? "No members match your search" : "No members in this group"}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        )}
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}