---
title: "FMOD Unity .gitignore"
date: 2024-11-13
categories: [Unity]
tags: [Unity, git, gitignore]
---

> 참고 : FMOD .gitignore

- FMOD 프로젝트를 Github에 올리고 관리하기 위해서 추적하는 파일들을 보니 너무 많고 올리지 않아도 되는 파일들이 딸려 들어오는것을 보게 되었다.
- 바로 gitignore 파일이 있는지 확인 해 보았고 위 참고 사이트에서 사용한 gitignore 파일을 적용하니 필요한 파일만 올라가게 되었다.

```
### FMOD Unity Integration ###
# Never ignore DLLs in the FMOD subfolder, so make sure that the FMOD-folder is in the correct path.
!/[Aa]ssets/Plugins/FMOD/**/*.dll

# Don't ignore images and gizmos used by FMOD in the Unity Editor
!/[Aa}ssets/Gizmos/FMOD/*
!/[Aa}ssets/Editor Default Resources/FMOD/*

# Ignore the Cache-file since it is updated locally either way
/[Aa]ssets/**/FMODStudioCache.asset
/[Aa]ssets/**/FMODStudioCache.asset.meta
/[Aa]ssets/Plugins/FMOD/Cache.meta
/[Aa]ssets/Plugins/FMOD/Cache/Editor.meta

# Log-files
fmod.log
fmod_editor.log

# FMOD 1.10.x (Legacy)
/Assets/FMODAssets/*
/Assets/FMODStudioCache.meta
```
