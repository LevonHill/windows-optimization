Asks for the AD username via the -TargetUsername parameter (you can also make this an interactive prompt, see below).

Resolves the SID for the given user.

Locates the user profile folder.

Deletes the following for the user:

Mapped network drives (Map Network Drive MRU and Network reg keys).

Stored Windows credentials in:
C:\Users\username\AppData\Roaming\Microsoft\Credentials

WebCache (browser cache & session storage):
C:\Users\username\AppData\Local\Microsoft\Windows\WebCache

✅ Confirmed Behavior
It targets the correct SID to modify per-user registry hives under HKEY_USERS.

It does not act until you provide a username, so it's safe to run interactively.

