import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { OverridableStringUnion } from '@mui/types';
import { Variant } from '@mui/material/styles/createTypography';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';

export default function CenteredText(props: {
    text1: string;
    text1Variant: OverridableStringUnion<
        Variant | 'inherit',
        TypographyPropsVariantOverrides
    >;
    text1TestId: string;
    text1AriaLabel: string;
    text2: string;
    text2Variant: OverridableStringUnion<
        Variant | 'inherit',
        TypographyPropsVariantOverrides
    >;
    text2TestId: string;
    text2AriaLabel: string;
}) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            <Box display="inline-flex" alignItems="center">
                <Typography
                    variant={props.text1Variant}
                    component="span"
                    style={{ lineHeight: 1 }}
                    data-testid={props.text1TestId}
                    aria-label={props.text1AriaLabel}
                >
                    {props.text1}
                </Typography>
                <Typography
                    variant={props.text2Variant}
                    data-testid={props.text2TestId}
                    aria-label={props.text2AriaLabel}
                    component="span"
                    style={{ lineHeight: 1, marginLeft: '8px' }}
                >
                    {props.text2}
                </Typography>
            </Box>
        </Box>
    );
}
