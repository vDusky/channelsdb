from string import ascii_uppercase

from api.common import SourceDatabase
from api.endpoints.channels import get_channels

HEADER = '''\
REMARK 920
REMARK 920  This file was generated by MOLE 2 (http://mole.upol.cz, http://mole.chemi.muni.cz, version 2.5.17.4.24)
REMARK 920
REMARK 920  Please cite the following references when reporting the results using MOLE:
REMARK 920
REMARK 920  Sehnal D., Svobodova Varekova R., Berka K., Pravda L., Navratilova V., Banas P., Ionescu C.-M., Geidl S., Otyepka M., Koca J.:
REMARK 920  MOLE 2.0: Advanced Approach for Analysis of Biomacromolecular Channels. Journal of Cheminformatics 2013, 5:39. doi:10.1186/1758-2946-5-39
REMARK 920 
REMARK 920  and
REMARK 920
REMARK 920  Berka, K; Hanak, O; Sehnal, D; Banas, P; Navratilova, V; Jaiswal, D; Ionescu, C-M; Svobodova Varekova, R; Koca, J; Otyepka M:
REMARK 920  MOLEonline 2.0: Interactive Web-based Analysis of Biomacromolecular Channels.Nucleic Acid Research, 2012, doi:10.1093/nar/GKS363
REMARK 920
REMARK ATOM  NAM RES   TUNID     X      Y       Z       Distnm RadiusA
'''


def get_PDB_file(source_db: SourceDatabase, protein_id: str) -> str:
    channels = get_channels(source_db, protein_id)
    total_atom_id = 0
    channel_count = 0
    lines = []
    for channel_type in channels['Channels']:
        for channel in channels['Channels'][channel_type]:
            channel_count += 1
            profile = channel['Profile']
            for current_atom_id, atom in enumerate(profile, start=1):
                total_atom_id += 1
                line = (f'HETATM{total_atom_id:>5d}  X   TUN {ascii_uppercase[(channel_count - 1) % 26]}{current_atom_id:>4}    '
                        f'{atom["X"]:>8.3f}{atom["Y"]:>8.3f}{atom["Z"]:>8.3f}'
                        f'{atom["Distance"]:>6.2f}{atom["Radius"]:>6.3f}')
                lines.append(line)

    return HEADER + '\n'.join(lines) + '\n'
